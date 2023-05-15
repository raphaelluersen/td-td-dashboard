import React, { useState, useEffect } from 'react';
import extractMeta from './extractMeta';
import { Configuration, OpenAIApi } from 'openai';
import { supabase } from './supabase-client';
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Loader2, Settings2 } from 'lucide-react';
import { Label } from '@/app/components/ui/label';
import { Input } from '../ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { Switch } from '@/app/components/ui/switch';

const BookmarksTab = () => {
  const [url, setUrl] = useState('');
  const [metaDataList, setMetaDataList] = useState<
    Array<Record<string, string> | null>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMultiUrlEnabled, setIsMultiUrlEnabled] = useState(false);
  const [editMetaData, setEditMetaData] = useState<Record<
    string,
    string
  > | null>(null);

  // Add this function to handle changes in the popover inputs
  const handleEditChange = (key: string, value: string) => {
    setEditMetaData((prevMetaData) => ({ ...prevMetaData, [key]: value }));
  };

  const handleExtractMeta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const urls = isMultiUrlEnabled ? url.split(',') : [url];
      const metaDataPromises = urls.map((singleUrl) => extractMeta(singleUrl));
      const metaDataResults = await Promise.allSettled(metaDataPromises);

      const metaDataListWithUrl = metaDataResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return {
            title: result.value.title || '',
            description: result.value.description || '',
            keywords: result.value.keywords || '',
            url: urls[index] || '',
            image: result.value.image || '',
          };
        } else {
          // Display failure for the website
          console.error(
            `Error fetching metadata for URL: ${urls[index]}`,
            result.reason
          );
          return {
            title: '',
            description: '',
            keywords: '',
            url: urls[index] || '',
            image: '',
          };
        }
      });

      setMetaDataList(metaDataListWithUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitToDatabase = async (
    metaData: Record<string, string> | null,
    url: string,
    index: number
  ) => {
    setIsLoading(true);
    try {
      const metaDataToString = metaData
        ? `
      BOOKMARK
      Title : ${metaData.title || 'N/A'}
      Description : ${metaData.description || 'N/A'}
      Tags : ${metaData.keywords || 'N/A'}
      URL : ${metaData.url || 'N/A'}
      Image : ${metaData.image || 'N/A'}
    `
        : '';
      console.log(metaDataToString);

      const configuration = new Configuration({
        apiKey: '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',
      });
      const openAi = new OpenAIApi(configuration);
      const embeddingResponse = await openAi.createEmbedding({
        model: 'text-embedding-ada-002',
        input: metaDataToString,
      });
      console.log(embeddingResponse);

      const [{ embedding }] = embeddingResponse.data.data;

      await supabase.from('documents').insert({
        content: metaDataToString,
        embedding,
      });
      console.log(metaDataToString, embedding);
      setMetaDataList((oldList) => oldList.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleExtractMeta} className="flex flex-col space-y-4">
        <Label
          htmlFor="uploadInput"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
        >
          Enter URL:
        </Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="multi-url-switch"
            checked={isMultiUrlEnabled}
            onCheckedChange={setIsMultiUrlEnabled}
          />
          <Label htmlFor="multi-url-switch">Enable Multi URL Mode</Label>
        </div>
        <Input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {isLoading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Extracting Metadata...
          </Button>
        ) : (
          <Button>Extract Metadata</Button>
        )}
      </form>
      {metaDataList.length > 0 &&
        !isLoading &&
        metaDataList.map((metaData, index) => (
          <Card key={index} className="m-5">
            <CardHeader>
              <CardTitle>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  New Bookmark
                </h2>
              </CardTitle>
              <div className="flex justify-between items-center">
                <CardDescription>
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Bookmark Details
                  </h4>
                </CardDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-10 rounded-full p-0"
                      onClick={() => setEditMetaData({ ...metaData })} // Set the initial value of editMetaData when the button is clicked
                    >
                      <Settings2 className="h-4 w-4" />
                      <span className="sr-only">Open popover</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Edit Details
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          You can edit the details before saving.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {editMetaData &&
                          Object.entries(editMetaData).map(([key, value]) => (
                            <div
                              className="grid grid-cols-3 items-center gap-4 w-auto"
                              key={key}
                            >
                              <Label htmlFor={key}>{key}</Label>
                              <Input
                                id={key}
                                value={value} // Use value instead of defaultValue
                                onChange={(e) =>
                                  handleEditChange(key, e.target.value)
                                } // Handle changes here
                                className="col-span-2 h-8 w-auto"
                              />
                            </div>
                          ))}
                      </div>
                      <Button
                        onClick={() => {
                          setMetaDataList(
                            metaDataList.map((md, mdIndex) =>
                              mdIndex === index ? editMetaData : md
                            )
                          );
                          setEditMetaData(null); // Reset the editMetaData state after saving
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="my-6 w-full overflow-y-auto">
                <table className="w-full transition-all duration-500 ease-in-out hover:shadow-lg rounded-lg overflow-hidden">
                  <thead className="bg-primary-foreground text-primary">
                    <tr className="m-0 p-0">
                      <th className="border px-4 py-2  font-bold text-center">
                        Bookmark Keys
                      </th>
                      <th className="border px-4 py-2  font-bold text-center">
                        Key Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="m-0 p-0 even:bg-muted transition-colors duration-500 hover:bg-accent hover:text-accent-foreground">
                      <td className="border px-4 py-2  text-center">Title</td>
                      <td className="border px-4 py-2  text-center">
                        {metaData?.title}
                      </td>
                    </tr>
                    <tr className="m-0 p-0 even:bg-muted transition-colors duration-500 hover:bg-accent hover:text-accent-foreground">
                      <td className="border px-4 py-2  text-center">
                        Description
                      </td>
                      <td className="border px-4 py-2  text-center">
                        {metaData?.description}
                      </td>
                    </tr>
                    <tr className="m-0 p-0 even:bg-muted transition-colors duration-500 hover:bg-accent hover:text-accent-foreground">
                      <td className="border px-4 py-2  text-center">
                        Keywords
                      </td>
                      <td className="border px-4 py-2  text-center">
                        {metaData?.keywords}
                      </td>
                    </tr>
                    <tr className="m-0 p-0 even:bg-muted transition-colors duration-500 hover:bg-accent hover:text-accent-foreground">
                      <td className="border px-4 py-2  text-center">URL</td>
                      <td className="border px-4 py-2  text-center">
                        {metaData?.url || 'Error❗❗❗  '}
                      </td>
                    </tr>
                    <tr className="m-0 p-0 even:bg-muted transition-colors duration-500 hover:bg-accent hover:text-accent-foreground">
                      <td className="border px-4 py-2  text-center">Images</td>
                      <td className="border px-4 py-2  text-center">
                        {metaData?.image}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubmitToDatabase(metaData, url, index)}
              >
                Submit to Database
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default BookmarksTab;
