function id(p_id)
{
   let output = document.getElementById(p_id);
   if(output == null) throw new Error("There is no element with id [" + p_id + "]");
   return output;
}

function list_to_map(p_list, p_property)
{
   let map = {};

   p_list.forEach(
         (p_item) =>
         {
            const name = p_item[p_property];
            map[name] = p_item;
         }
      );

   return map;
}

function create_svg_foreign_object(p_center_x, p_center_y, p_width, p_height, p_content, p_css_class)
{
   const css_class = ((p_css_class === undefined) || (p_css_class == null)) ? (``) : (`class="${p_css_class}"`);
   
   return `<foreignObject x="${p_center_x - p_width / 2}" y="${p_center_y -p_height / 2}" width="${p_width}" height="${p_height}">`
   + `<div xmlns="http://www.w3.org/1999/xhtml" style="padding:0 auto"><div ${css_class}>${p_content}</div></div>`
   + `</foreignObject>`;
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
   let series_title_width = Math.max(400, series_width);
   let series_title_y = -(g_series_height/2) + g_series_title_height / 2;

   let book_start_x = -(series_width / 2);
   let book_start_y = -(g_series_height / 2) + g_series_title_height + g_series_padding;

   a.push(`<g transform="translate(${p_position.x},${p_position.y})">`);
   a.push(`   <g>`);
   a.push(`      <rect x="${-(series_width/2)}" y="${-(g_series_height/2)}" width="${(series_width)}" height="${(g_series_height)}" class="cssSeries" filter="url(#ID_BackgroundShadow)"/>`);
/*
   a.push(`      <text x="${series_title_x}" y="${series_title_y}" dominant-baseline="middle" text-anchor="middle" class="cssSeriesShadow">${p_series.name}</text>`);
   a.push(`      <text x="${series_title_x}" y="${series_title_y}" dominant-baseline="middle" text-anchor="middle" class="cssSeries">${p_series.name}</text>`);
*/


   a.push(create_svg_foreign_object(series_title_x, series_title_y, series_title_width, g_series_title_height, `<b>${p_series.name}</b>`, "cssSeriesTitle"));

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

