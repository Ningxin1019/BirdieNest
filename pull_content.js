let url=""
let data;
let originalAboutText = document.getElementById('about-text').innerHTML;

fetch(url)
.then(response => response.text())
.then(csvText => {
  data = csvText.split('\n').map(row => row.split('\t'));
  console.log(data);
});
.catch(error => console.error('Error loading TSV:', error));



function updateText(){
    let projectList = document.getElementById('project-list');
    projectList.innerHTML = "";
    for (let i = 0; i < data.length; i++){
        let projectName = data[i][0];
        let projectDescription = data[i][1];
        let projectLink = data[i][2];

        let proj

}