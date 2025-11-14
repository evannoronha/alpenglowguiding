import type { Schema, Struct } from '@strapi/strapi';

export interface BodyImage extends Struct.ComponentSchema {
  collectionName: 'components_body_images';
  info: {
    displayName: 'image';
  };
  attributes: {
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'files' | 'images'> &
      Schema.Attribute.Required;
  };
}

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

export interface ProgramsProgramPageSection extends Struct.ComponentSchema {
  collectionName: 'components_programs_program_page_sections';
  info: {
    displayName: 'program_page_section';
  };
  attributes: {
    section_content: Schema.Attribute.Blocks;
    section_header: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'body.image': BodyImage;
      'body.markdown': BodyMarkdown;
      'body.rich-text': BodyRichText;
      'body.video': BodyVideo;
      'programs.program-page-section': ProgramsProgramPageSection;
    }
  }
}
