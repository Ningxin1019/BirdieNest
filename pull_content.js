// pull_content.js
async function loadContent() {
    try {
      // 替换为你的 Google Sheets 发布的 CSV URL
      const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpdnHRLhl0mQyIzAOjMeTBzFUHrrnzrh3cLwJroYNTROQl1h8tf_ceekKXzhxSHD0n7AxPL_nJQH67/pub?output=csv'
      // ';
      
      // 获取 CSV 数据
      const response = await fetch(csvUrl);
      const csvData = await response.text();
      
      // 使用 Papa Parse 解析 CSV
      const parsedData = Papa.parse(csvData, {
        header: true, // 第一行为列名
        skipEmptyLines: true
      }).data;
  
      // 渲染到页面
      const container = document.getElementById('content-container');
      container.innerHTML = parsedData.map(item => `
        <div class="content-item">
          <h2>${item.Title}</h2>
          <p>${item.Description}</p>
          <img src="${item.ImageURL}" alt="${item.Title}" width="200">
        </div>
      `).join('');
  
    } catch (error) {
      console.error('加载内容失败:', error);
      document.getElementById('content-container').innerHTML = 
        '<p>内容加载失败，请稍后重试。</p>';
    }
  }
  
  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', loadContent);