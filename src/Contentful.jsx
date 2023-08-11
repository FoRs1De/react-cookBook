import { createClient } from 'contentful';

const Contentful = () => {
  const client = createClient({
    space: 'fvwgdnm4oux1',
    accessToken: '0F1deS2w-aiyaJ1sP8kSQU3A0hdskYT2rTMMbqWNK5o',
    host: 'preview.contentful.com',
  });

  const getCookbook = async () => {
    try {
      const entries = await client.getEntries({
        content_type: 'cookbook',
        select: 'fields',
      });

      const saniEntries = entries.items.map((item) => {
        const name = item.fields.name;
        const description = item.fields.description;
        const ingredients = item.fields.ingredients;
        const img = item.fields.img.fields.file.url;

        const id = item.sys.id;
        const group = item.fields.group;
        return { name, description, ingredients, img, id, group };
      });

      return saniEntries;
    } catch (error) {
      console.log(error);
    }
  };

  return { getCookbook };
};

export default Contentful;
