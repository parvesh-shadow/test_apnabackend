/**
 * SEO Template for Server-Side Rendering
 * Generates dynamic HTML with SEO meta tags from database
 */

function seoTemplate({ title, description, scripts, appHtml, cssFiles, jsFiles }) {
    // Sanitize scripts to prevent XSS
    const sanitizedScripts = scripts && scripts.length > 0
        ? scripts.map(script => script.trim()).join('\n      ')
        : '';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" sizes="48x48" href="/assets/logo-BdHZwnLv.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title || 'Apna Project'}</title>
    <meta name="description" content="${description || 'Welcome to Apna Project'}" />
    
    ${cssFiles.map(css => `<link rel="stylesheet" crossorigin href="${css}">`).join('\n    ')}
    
    ${sanitizedScripts ? `<script>${sanitizedScripts}</script>` : ''}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    ${jsFiles.map(js => `<script type="module" crossorigin src="${js}"></script>`).join('\n    ')}
  </body>
</html>`;
}

module.exports = seoTemplate;
