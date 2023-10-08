import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load } from 'cheerio';

const phoneRegex = /\(\d+\)\s*\d+(\.\d+)?/;
const regex = /(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo|sábados)[^\d]*(\d{1,2}h\s*às\s*\d{1,2}h)/g;

async function fetchHtml(url) {
  try {
    const { data } = await axios.get(url, { headers: { "Accept-Encoding": null }, 'responseType': 'arraybuffer', 'responseEncoding': 'binary' });
    return data.toString('latin1'); // Ensure correct encoding
  } catch (error) {
    throw Error(`Error fetching the HTML: ${error}`);
  }
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getStock(): Promise<Object | null> {
    const url = 'https://www.hemosc.org.br';
    try {
      const html = await fetchHtml(url)
      const $ = load(html, { 'decodeEntities': false })
      const stockText = $('div#tudo_desk div.fund_brnc div.topo div.dirt_topo a div.dirt_home_estq').text();
      const stockList = stockText.split('\n').filter(item => item !== '')
      return stockList
    }
    catch {
      return null
    }
  }

  async getNews(): Promise<Object | null> {
    const url = 'https://www.hemosc.org.br';
    try {
      const html = await fetchHtml(url)
      const $ = load(html, { 'decodeEntities': false })
      const newsArray = [];
      $('.col-xs-12.col-sm-6.col-md-6.col-lg-3.notc_espc_cell').each((index, element) => {
        const title = $(element).find('.titl_notc_prin2.font_dinn_medi').text();
        const imageUrl = $(element).find('img.img-responsive').attr('src');
        const description = $(element).find('.text_notc_prin.text_brnc.font_dinn_medi').text();
        const newsUrl = $(element).find('.linknotc').attr('href');
        const newsItem = {
          title,
          imageUrl,
          description,
          newsUrl
        };
        newsArray.push(newsItem);
      })
      return newsArray;
    }
    catch {
      return null
    }
  }

  async getContact(): Promise<Object | null> {
    try {
      const unitsList = [];
      const url = 'https://www.hemosc.org.br/onde-doar.html';
      const html = await fetchHtml(url);
      const $ = load(html, { 'decodeEntities': false });
      $('.tudo_doar').each((index, element) => {
        const name = $(element).find('.font_din_blac.text_verm').text();
        const phone = $(element).find('.font_din_blac').text().match(phoneRegex)[0].replace('.', '-');
        const details = [];
        $(element).find('.text_tudo_doar').each((index, el) => {
          const time = $(el).text().trim().match(regex)
          if (time !== null) {
            details.push(time);
          }
        });
        const newsItem = {
          name,
          phone,
          details
        };

        unitsList.push(newsItem);
      })
      return unitsList;
    }
    catch (error) {
      console.log(error)
      return null;
    }
  }
}
