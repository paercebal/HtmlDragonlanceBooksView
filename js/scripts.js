function id(p_id)
{
   let output = document.getElementById(p_id);
   if(output == null) throw new Error("There is no element with id [" + p_id + "]");
   return output;
}


const g_book_width = 45;
const g_book_height = 75;
const g_series_padding = 5;
const g_series_title_height = 30;
const g_series_height = g_book_height + (g_series_padding * 2) + g_series_title_height;


function draw_one_series_in_svg(p_series, p_position)
{
   let a = [];


   let books_count = p_series.books.length;
   let series_width = (g_book_width * books_count) + (g_series_padding * (books_count + 1));

   let series_title_x = 0;
   let series_title_y = -(g_series_height/2) + g_series_title_height / 2;

   let book_start_x = -(series_width / 2);
   let book_start_y = -(g_series_height / 2) + g_series_title_height + g_series_padding;

   a.push(`<g transform="translate(${p_position.x},${p_position.y})">`);
   a.push(`   <g>`);
   a.push(`      <rect x="${-(series_width/2)}" y="${-(g_series_height/2)}" width="${(series_width)}" height="${(g_series_height)}" class="cssSeries" filter="url(#ID_BackgroundShadow)"/>`);
   a.push(`      <text x="${series_title_x}" y="${series_title_y}" dominant-baseline="middle" text-anchor="middle" class="cssSeriesShadow">${p_series.name}</text>`);
   a.push(`      <text x="${series_title_x}" y="${series_title_y}" dominant-baseline="middle" text-anchor="middle" class="cssSeries">${p_series.name}</text>`);

   for(let i = 0; i < p_series.books.length; ++i)
   {
      let book = p_series.books[i];
      let book_x = book_start_x + (g_book_width * i) + (g_series_padding * (i + 1));
      let book_y = book_start_y;
      let image_url = `./covers/${book.name}.webp`;
      
      a.push(`      <rect x="${book_x}" y="${book_y}" width="${g_book_width}" height="${g_book_height}" />`);
      a.push(`      <image x="${book_x}" y="${book_y}" width="${g_book_width}" height="${g_book_height}" href="${image_url}" filter="url(#ID_BackgroundShadow)" />`);
   }

   a.push(`   </g>`);
   a.push(`</g>`);

   return a.join("");
}

