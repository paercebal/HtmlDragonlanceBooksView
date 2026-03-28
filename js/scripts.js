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

   let title_content = `<b>${p_series.name}</b>`;

   if(Object.hasOwn(p_series, "wiki_link"))
   {
      title_content = `<a href="${p_series.wiki_link}" target="_blank">` + title_content + '</a>';
   }

   a.push(create_svg_foreign_object(series_title_x, series_title_y, series_title_width, g_series_title_height, title_content, "cssSeriesTitle"));

   for(let i = 0; i < p_series.books.length; ++i)
   {
      let book = p_series.books[i];
      let book_x = book_start_x + (g_book_width * i) + (g_series_padding * (i + 1));
      let book_y = book_start_y;
      let image_url = `./covers/${book.name}.webp`;
      const has_wiki_link = Object.hasOwn(book, "wiki_link");
      
      //a.push(`      <rect x="${book_x}" y="${book_y}" width="${g_book_width}" height="${g_book_height}" />`);
      if(has_wiki_link)
      {
         a.push(`<a href="${book.wiki_link}" target="_blank">`);
      }
      a.push(`<image x="${book_x}" y="${book_y}" width="${g_book_width}" height="${g_book_height}" href="${image_url}" filter="url(#ID_BackgroundShadow)" />`);
      if(has_wiki_link)
      {
         a.push(`</a>`);
      }
   }

   a.push(`   </g>`);
   a.push(`</g>`);

   return a.join("");
}



function draw_organized_series_in_svg(p_start_position)
{
   let a_boxes = [];
   let a_links = [];

   const novels_map = list_to_map(g_novels_list, "name");

   //alert(JSON.stringify(novels_map));

   const start_x = p_start_position.x;
   const start_y = p_start_position.y;

   const size_x = 250;
   const text_why_size_y = 43;
   const block_why_size_y = text_why_size_y + 7;
   const elbow_y = 20;
   const size_y = g_series_height + block_why_size_y + elbow_y;

   for(let y = 0; y < g_novels_organization.length; ++y)
   {
      for(let x = 0; x < g_novels_organization[y].length; ++x)
      {
         let item_name = g_novels_organization[y][x];
         
         if(item_name != null)
         {
            const item = novels_map[item_name];
            
            let position = {};
            position.x = (x - 1) * size_x + start_x;
            position.y = y * size_y + start_y;

            //alert(`${x},${y}|${position.x},${position.y}:${item_name}`);

            const series_svg = draw_one_series_in_svg(item, position);
            a_boxes.push(series_svg);

            if(y > 0)
            {
               const why_text_svg = create_svg_foreign_object(position.x, (position.y - ((text_why_size_y + g_series_height) / 2)), size_x, text_why_size_y, item.why, "cssWhy");
               a_boxes.push(why_text_svg);
            }

            const line_start_x = start_x;
            const line_start_y = start_y;

            const elbow_to_end_y = (g_series_height / 2) + block_why_size_y;

            const line_first_elbow_x = line_start_x;
            const line_first_elbow_y = position.y - elbow_to_end_y;

            const line_second_elbow_x = position.x;
            const line_second_elbow_y = line_first_elbow_y;

            const line_end_x = line_second_elbow_x;
            const line_end_y = position.y;

/*
            a_links.push(`<polyline class="cssArrow" points="`
               , `${line_start_x},${line_start_y} `
               , `${line_first_elbow_x},${line_first_elbow_y} `
               , `${line_second_elbow_x},${line_second_elbow_y} `
               , `${line_end_x},${line_end_y} `
               , `" />`);
*/  

            if(y > 0)
            {
               //alert(`${line_start_x},${line_start_y} -> ${line_first_elbow_x},${line_first_elbow_y}`);
               //alert(`${line_first_elbow_x},${line_first_elbow_y} -> ${line_second_elbow_x},${line_second_elbow_y}`);

               a_links.push(`<line class="cssArrow" x1="${line_start_x}" y1="${line_start_y}" x2="${line_first_elbow_x}" y2="${line_first_elbow_y}" />`);

               a_links.push(`<line class="cssArrow" x1="${line_first_elbow_x}" y1="${line_first_elbow_y}" x2="${line_second_elbow_x}" y2="${line_second_elbow_y}" />`);

               a_links.push(`<line class="cssArrow" x1="${line_second_elbow_x}" y1="${line_second_elbow_y}" x2="${line_end_x}" y2="${line_end_y}" />`);
            }
         }
      }
   }
   
   return a_links.join("") + a_boxes.join("");
}


