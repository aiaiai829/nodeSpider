const cheerio = require('cheerio')
const superagent = require('superagent')

const getHotNews = (products) => {
  let hotNews = []
  // 访问成功，请求页面所返回的数据会包含在res.text中。

  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  // let $ = cheerio.load(res.text)

  // // 找到目标数据所在的页面元素，获取数据
  // $('.SearchResults ul li .ProductCard').each((idx, ele) => {
  //  console.log(ele)
  //   let news = {
  //     img: $(ele).children('ProductCard-image').children('ProductCard-image--primary').find('img').attr('src'),        
  //     title: $(ele).children('ProductCard-image').children('ProductCard-image--primary').find('img').attr('alt'),
  //     link: `https://www.footlocker.com${$(ele).children('ProductCard-link').attr('href')}`,
  //     price: $(ele).children('ProductCard-link').children('ProductPrice').text()
  //   }
  //   hotNews.push(news)
  // })
  // Math.round(new Date() / 1)
  products.forEach(item => {
    // 递归请求
    let currentIndex = 0;
    function getImg() {
      if (currentIndex >= products.length) {
        return;
      }
      const _url = item.url;
      const name = item.name.toLowerCase().split(' ')
      let _urlName = ''
      const len = name.length
      if(name[len - 1] === "men's"){
        _urlName = name.splice(len - 2, 1).splice(len - 1, 1, 'mens').join('-')
      } else if(name[len - 1] === "women's"){
        _urlName = name.splice(len - 2, 1).splice(len - 1, 1, 'womens').join('-')
      } else if(name[len - 1] === 'preschool' && name[len - 2] === "boys'"){
        _urlName = name.splice(len - 3, 1).splice(len - 2, 2, 'boys-preschool').join('-')
      } else if(name[len - 1] === 'preschool' && name[len - 2] === "girls'"){
        _urlName = name.splice(len - 3, 1).splice(len - 2, 2, 'girls-preschool').join('-')
      } else if(name[len - 1] === 'toddler' && name[len - 2] === "boys'"){
        _urlName = name.splice(len - 3, 1).splice(len - 2, 2, 'boys-toddler').join('-')
      } else if(name[len - 1] === 'toddler' && name[len - 2] === "girls'"){
        _urlName = name.splice(len - 3, 1).splice(len - 2, 2, 'girls-toddler').join('-')
      } else if(name[len - 1] === 'school' && name[len - 3] === "boys'"){
        _urlName = name.splice(len - 4, 1).splice(len - 3, 3, 'boys-grade-toddler').join('-')
      } else if(name[len - 1] === 'school' && name[len - 3] === "girls'"){
        _urlName = name.splice(len - 4, 1).splice(len - 3, 3, 'girls-grade-toddler').join('-')
      }
      // "Boys' Preschool" , "Boys' Toddler" , "Boys' Grade School" , "Girls' Grade School" , "Girls' Preschool" , "Girls' Toddler"
      const baseProduct = item.baseProduct
      superagent
        .get(`https://www.footlocker.com/api/products/pdp/${_url}`)
        .query({
          timestamp: Math.round(new Date() / 1)
        })
        .set("accept", "application/json")
        .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36")
        .set("Referer", `https://www.footlocker.com/product/${_urlName}/${_url}.html`)
        .end((err, res2) => {
          if (err) {
            // 如果访问失败或者出错，
            console.log(`${currentIndex}鞋码获取出错`,err)
            currentIndex++;
            getImg();
          } else {
            // 访问成功
            console.log(`${currentIndex}鞋码获取成功`)
            const { text = {} } = res2
            const data2 = JSON.parse(text)
            const { sellableUnits = [] } = data2
            const sizeData = []
            sellableUnits.forEach(ele => {
              ele.attributes[1].id === baseProduct && sizeData.push({
                size: ele.attributes[0].value,
                price: ele.price.formattedValue,
                status: ele.stockLevelStatus === 'inStock' ? '在售' : '无货'
              })
            })
            hotNews.push({
              name: item.name,
              code: item.code,
              images: item.images[0].url,
              sizeData: sizeData
            })
            currentIndex++;
            getImg();
          }
        })
    }
    getImg()
  });

  return hotNews
}

module.exports = getHotNews