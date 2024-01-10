import { FlexLayout, QComboBox, QLineEdit, QMainWindow, QPushButton, QTextEdit, QWidget } from '@nodegui/nodegui';
import axios from 'axios';
let cheerio = require('cheerio');

async function scraper(link: any, selectedTag: String){
  const temp = await axios.get(link)
  const $ = cheerio.load(temp.data);
  const tag = $(selectedTag);
  return tag.html();
}

// async function Scraper(link: string, selectedTag: string) {
//   try {
//     const response = await axios.get(link);
//     const data = response.data;
//     console.log("ln7 " + data["body"] +" , "+ selectedTag +" , "+ link);
//     if(selectedTag === 'Custom'){
//       return data;
//     }

//     if(data != null){
//       console.log("data - custom");
//       return data[selectedTag];
//     }else{
//       console.log("data - custom tag failed")
//       return null;
//     }
//   } catch (err) {
//     console.log("data - retrived failed")
//     console.error('Error:', err);
//     return null;
//   }
// }

const win = new QMainWindow();
win.setWindowTitle("Web Scraper");

const mainWidget = new QWidget();
mainWidget.setObjectName('mainWidget');

const layout = new FlexLayout();
mainWidget.setLayout(layout);

const userInput = new QLineEdit();
userInput.setPlaceholderText('Enter URL');

const tagMenu = new QComboBox();
tagMenu.addItem(undefined, 'html');
tagMenu.addItem(undefined, 'head');
tagMenu.addItem(undefined, 'body');
tagMenu.addItem(undefined, 'text');
tagMenu.addItem(undefined, 'Custom');
tagMenu.setCurrentIndex(0);

const customTagInput = new QLineEdit();
customTagInput.setPlaceholderText('Enter Custom Tag');
customTagInput.setVisible(false);

tagMenu.addEventListener('currentIndexChanged', (index) => {
  const isCustomTagSelected = tagMenu.currentText() === 'Custom';
  customTagInput.setVisible(isCustomTagSelected);
});

const results = new QTextEdit();
results.setObjectName('results');
results.setReadOnly(true);

const scrapeButton = new QPushButton();
scrapeButton.setText('Scrape');
scrapeButton.addEventListener('clicked', async () => {
  const link = userInput.text();
  const selectedTag =
    tagMenu.currentText() === 'Custom'
    ? customTagInput.text()
    :tagMenu.currentText();

  if(link){
    //const data = await Scraper(link, selectedTag);
    const data = await scraper(link, selectedTag);
    if(data != null){
      results.setHtml(`Fetched data:\n<pre>${data}</pre>`);
    }else{
      results.setText('Failed to fetch data or Tag not found.');
    }
  }else{
    results.setText('Please enter a valid link.');
  }
});

layout.addWidget(userInput);
layout.addWidget(tagMenu);
layout.addWidget(customTagInput);
layout.addWidget(scrapeButton);
layout.addWidget(results);

win.setCentralWidget(mainWidget);

win.show();

(global as any).win = win
