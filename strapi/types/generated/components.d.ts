import type { Schema, Struct } from '@strapi/strapi';

export interface BodyMarkdown extends Struct.ComponentSchema {
  collectionName: 'components_body_markdowns';
  info: {
    displayName: 'markdown';
  };
  attributes: {
    markdown: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface BodyRichText extends Struct.ComponentSchema {
  collectionName: 'components_body_rich_texts';
  info: {
    displayName: 'rich_text';
  };
  attributes: {
    rich_text: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface BodyVideo extends Struct.ComponentSchema {
  collectionName: 'components_body_videos';
  info: {
    displayName: 'video';
  };
  attributes: {
    video: Schema.Attribute.Media<'files' | 'videos'> &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'body.markdown': BodyMarkdown;
      'body.rich-text': BodyRichText;
      'body.video': BodyVideo;
    }
  }
}
