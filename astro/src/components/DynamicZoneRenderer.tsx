import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import React from "react";
import { marked } from "marked";

interface DynamicZoneRendererProps {
  content: any[];
}

// Helper to ensure URLs are absolute
const getStrapiUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;

  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Get STRAPI_URL from environment or use default
  const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'https://celebrated-victory-07e0d5532b.strapiapp.com';

  // If relative URL, prepend STRAPI_URL
  return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const DynamicZoneRenderer: React.FC<DynamicZoneRendererProps> = ({ content }) => {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return (
    <>
      {content.map((block, index) => {
        const componentType = block.__component;

        switch (componentType) {
          case "body.rich-text":
            // Render rich text using BlocksRenderer
            return (
              <div key={index} className="rich-text-block">
                <BlocksRenderer content={block.rich_text} />
              </div>
            );

          case "body.markdown":
            // Parse markdown to HTML
            const markdownHtml = marked(block.markdown || '');
            return (
              <div
                key={index}
                className="markdown-block"
                dangerouslySetInnerHTML={{ __html: markdownHtml }}
              />
            );

          case "body.video":
            // Render video
            const videoUrl = getStrapiUrl(block.video?.url);
            if (!videoUrl) return null;

            return (
              <div key={index} className="video-block">
                <div className="video-container">
                  <video preload="metadata" controls muted autoPlay={false}>
                    <source src={videoUrl} type={block.video?.mime || "video/mp4"} />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <style>{`
                  .video-container {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                  }

                  .video-container video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                  }
                `}</style>
              </div>
            );

          default:
            console.warn(`Unknown component type: ${componentType}`);
            return null;
        }
      })}
    </>
  );
};

export default DynamicZoneRenderer;
