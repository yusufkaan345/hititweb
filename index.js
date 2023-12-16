var isAddTriangle = false; // Üçgen eklemek için kullanılacak değişken
var isAddLine = false; // Çizgi eklemek için kullanıclacak değişken
var isAdd4 = false
var isAdd5 = false

const pointTriangleList = []; // Üçgen nokta koordinatlarını saklamak için bir dizi
const pointTriangleListTrash = []; //İptal durumunda boşaltılacak liste
const pointLineList = []; // Çizgi nokta koordinatlarını saklamak için bir dizi
const pointLineListTrash = [];
var pointTempleList=[]; //Şablon ekleme 4 nokta


const pointTriangleSets = []; // Üçgen nokta kümelerini saklamak için bir dizi.Yani bir üçgen oluşturulduğunda dizi olarak tüm koordinatlar bunun içinde olacak 
const pointLineSets = []; // Çizgi nokta kümelerini saklamak için kullanılacak dizi
var pointTemple4=[];    // 4Lü nokta setini saklamak için dizi
var pointTemple5=[];    // 5li nokta setini saklamak için dizi 

const pointSets = []; // Üçgen ve çizgilerden oluşan bir harf seti. Save bastığında setler içerisindeki nokta ve çizgileri alıp bu son liste içerisinde o heceyi saklayacak
const wordSets = []; //hecelerden oluşan kelimeleri sakladığımız yer
const sentenceSets = []

const container = document.getElementById('container-image');

var trashLine=[];

var lineList = []; //eklenen her bir çizgiyi kaydettiğimiz yer . Su an çizgilerle bir işimiz yok ama yinede bir id ile kaydettim hepsini.
var lineCounter = 0; // Çizgiye benzersiz bir id atamak için sayaç
var dotCounter = 0; // Noktaya benzersiz id atamak için sayaç

const MIN_DISTANCE_THRESHOLD = 10; // Eklenen çizgi  ile üçgen noktalarının koordinatları arasındaki mesafe bundan küçükse 
const connectedPoints = [];

const totalImages = 3;
var currentImageIndex = 1;

var tablet = document.getElementById("tablet");
var originalImageWidth = tablet.width;
var originalImageHeight = tablet.height;

const initialImage = document.getElementById('tablet');
tablet.src = 'img/tablet1.jpeg';

const cancelButton = document.getElementById('cancelButton'); 

var zoomInButton = document.getElementById("zoomInButton");
var zoomOutButton = document.getElementById("zoomOutButton");
var zoomLevel = 1;

var selectedDot = null; // Seçilen noktanın referansını tutacak değişken
// Add event listener to each point for selection
const points = document.querySelectorAll('.point');
points.forEach(point => {
    point.addEventListener('click', function(event) {
        if (selectedDot === point) {
            // If the clicked point is already selected, deselect it
            selectedDot.style.backgroundColor = '';
            selectedDot = null;
        } else {
            // Otherwise, select the clicked point
            if (selectedDot) {
                selectedDot.style.backgroundColor = '';
            }
            selectedDot = point;
            selectedDot.style.backgroundColor = '#c44dff';
        }
    });
});


zoomInButton.addEventListener("click", zoomIn);
zoomOutButton.addEventListener("click", zoomOut);

document.getElementById('nextButton').addEventListener('click', loadNextImage);
document.getElementById('prevButton').addEventListener('click', loadPrevImage);

var specialChars = document.querySelectorAll('.accent-cell');
specialChars.forEach(function(char) {
    char.addEventListener('click', specialCharCase);
});

document.getElementById('addSyllable').addEventListener('click', addSyllableCardToList);
document.getElementById('addWordBtn').addEventListener('click', addWordCard);
document.getElementById('addSentenceBtn').addEventListener('click', addSentenceCard)
document.getElementById('saveBtn').addEventListener('click', saveTransactions)

function addButtonEventListener(btnId, flagName) {
    document.getElementById(btnId).addEventListener('click', function () {
        isAddTriangle = flagName === 'isAddTriangle';
        isAddLine = flagName === 'isAddLine';
        isAdd4 = flagName === 'isAdd4';
        isAdd5 = flagName === 'isAdd5';
    });
}
addButtonEventListener('addTriangleBtn', 'isAddTriangle');
addButtonEventListener('addLineBtn', 'isAddLine');
addButtonEventListener('add-4', 'isAdd4');
addButtonEventListener('add-5', 'isAdd5');
function updateLines(dot) {
    var lines=[]
    lineList.forEach(item=>{
        if(item.endPoint == dot.id || item.startPoint==dot.id){
            lines.push(document.getElementById(item.id))
        }
    })
    console.log(lines)
 
}
function addDot(x, y) {

    var point = document.createElement('div');
    point.className = 'point';
    point.style.left = x + 'px';
    point.style.top = y + 'px';
    point.dataset.originalX = (x) / zoomLevel;
    point.dataset.originalY = (y) / zoomLevel;
    point.id = 'point-' + dotCounter; // Dotlara unique ID atama
    dotCounter++;
    pointTempleList.push(point)
    container.appendChild(point);
}
// Click event to move the selected point
container.addEventListener('click', function (event) {
    if (selectedDot) {
        const containerRect = container.getBoundingClientRect();
        const scrolledX = event.clientX - containerRect.left + container.scrollLeft;
        const scrolledY = event.clientY - containerRect.top + container.scrollTop;

        // Calculate new original coordinates for the selected point
        const newOriginalX = scrolledX / zoomLevel;
        const newOriginalY = scrolledY / zoomLevel;

        // Update the dataset values for the selectedDot
        selectedDot.dataset.originalX = newOriginalX;
        selectedDot.dataset.originalY = newOriginalY;

        // Update the visual position of the selectedDot
        selectedDot.style.left = scrolledX + 'px';
        selectedDot.style.top = scrolledY + 'px';
        updateLines(selectedDot);

        // Clear the selection after moving the point
        selectedDot.style.backgroundColor = ''; 
        selectedDot = null;
    }
});

container.addEventListener('click', function (event) {
    const containerRect = container.getBoundingClientRect();
    const scrolledX = event.clientX - containerRect.left + container.scrollLeft;
    const scrolledY = event.clientY - containerRect.top + container.scrollTop;
    const selectedPoint = event.target;
    
    // Sadece nokta elementlerini seç
    if (selectedPoint.classList.contains('point')) {
        // Seçilen noktanın rengini değiştir
        if (selectedDot) {
            selectedDot.style.backgroundColor = ''; // Önceki seçili noktanın rengini sıfırla
        }
        selectedDot = selectedPoint;
        selectedDot.style.backgroundColor = '#c44dff'; // Yeni seçilen noktanın rengini değiştir
       
    }
   
    if(isAdd4){
        var x = event.clientX - container.getBoundingClientRect().left
        var y = event.clientY - container.getBoundingClientRect().top

        addDot(x, y);        //orta nokta   1     
        addDot(x + 20, y - 10); // sağ yukarı 2           
        addDot(x - 20, y - 10);  //sol yukarı 3
        addDot(x, y + 40);     //alt nokta  4  
        

        const dot1=document.getElementById('point-' + (dotCounter-4)) //orta nokta    1  
        const dot2 = document.getElementById('point-' + (dotCounter-3)) // sağ yukarı 2
        const dot3 = document.getElementById('point-' + (dotCounter-2)) //sol yukarı  3
        const dot4 = document.getElementById('point-' + (dotCounter-1)) //alt nokta   4  

        drawLine(dot1,dot2);
        drawLine(dot1,dot3);
        drawLine(dot1,dot4);
        drawLine(dot2,dot3);
        const newPointSet = pointTempleList.slice();
        pointTemple4.push(newPointSet);
        pointTempleList.length=0;
        isAdd4 = false;

    }

    if(isAdd5){
        var x = event.clientX - container.getBoundingClientRect().left
        var y = event.clientY - container.getBoundingClientRect().top

        addDot(x - 20, y);     //1                             
        addDot(x, y - 10);     //2                         
        addDot(x, y + 10);     //3                     
        addDot(x + 20, y - 25);  //4                         
        addDot(x + 20, y + 25);  //5  

        const dot1=document.getElementById('point-' + (dotCounter-5))   //orta en sol
        const dot2 = document.getElementById('point-' + (dotCounter-4)) //yukarı 1
        const dot3 = document.getElementById('point-' + (dotCounter-3)) //aşağı 1
        const dot4 = document.getElementById('point-' + (dotCounter-2)) //yukarı 2  
        const dot5 = document.getElementById('point-' + (dotCounter-1)) //aşağı 2

        drawLine(dot1,dot2);  
        drawLine(dot1,dot3);
        drawLine(dot2,dot3);
        drawLine(dot2,dot4);
        drawLine(dot3,dot5);
        const newPointSet = pointTempleList.slice();
        pointTemple5.push(newPointSet);
        pointTempleList.length=0;
        isAdd5 = false;

    }
    if (isAddLine) {
        const point = document.createElement('div');
        const pointId = `point-${dotCounter}`;
        point.id = pointId;
        dotCounter++;
        point.className = 'point';

        point.dataset.originalX = (scrolledX) / zoomLevel;
        point.dataset.originalY = (scrolledY) / zoomLevel;
        

        // Çizginin eklenen noktası üçgenin hangi noktasına yakın for ile kontrol et
        if (pointLineList.length === 0) {
            let closestTrianglePoint = null; // En yakın üçgen noktasını saklamak için değişken
            let minDistance = Number.MAX_VALUE; // En küçük mesafeyi saklamak için değişken
            
            for (const triangleSet of pointTriangleSets) {
                for (const trianglePoint of triangleSet) {
                    if (!trianglePoint.connected) {
                        const distance = Math.sqrt(
                            Math.pow(parseFloat(point.dataset.originalX) - parseFloat(trianglePoint.x), 2) +
                            Math.pow(parseFloat(point.dataset.originalY) - parseFloat(trianglePoint.y), 2)
                        );

                        if (distance < minDistance) {
                            minDistance = distance;
                            closestTrianglePoint = trianglePoint;
                        }
                    }
                }
            }

            if (closestTrianglePoint) {
                point.dataset.originalX = closestTrianglePoint.x;
                point.dataset.originalY = closestTrianglePoint.y;
                point.style.backgroundColor = 'red';
                closestTrianglePoint.connected = true; // Bağlantıyı işaretle
            }
            
        }

        pointLineList.push({ id: pointId, x: point.dataset.originalX, y: point.dataset.originalY });
        container.appendChild(point);
         
        if (pointLineList.length == 2) {
            const firstPoint = pointLineList[0];
            const secondPoint = pointLineList[1];


            drawLine(document.getElementById(firstPoint.id), document.getElementById(secondPoint.id));
            
            const newPointSet = pointLineList.slice();
            pointLineSets.push(newPointSet);
            isAddLine = false;
            pointLineList.forEach(item => pointLineListTrash.push(item))
            pointLineList.length = 0;

        }
        
    }
    
    if (isAddTriangle) {
        const point = document.createElement('div');
        const pointId = `point-${dotCounter}`;
        point.id = pointId;
        dotCounter++;
        point.className = 'point';
        point.dataset.originalX = (scrolledX) / zoomLevel;
        point.dataset.originalY = (scrolledY) / zoomLevel;

        pointTriangleList.push({ id: pointId, x: point.dataset.originalX, y: point.dataset.originalY });


        container.appendChild(point);

        if (pointTriangleList.length >= 2) {
            const firstPoint = pointTriangleList[0];
            const startPoint = pointTriangleList[pointTriangleList.length - 2];
            const endPoint = pointTriangleList[pointTriangleList.length - 1];

            drawLine(document.getElementById(startPoint.id), document.getElementById(endPoint.id));
            trashLine.push(startPoint.id)
            if (pointTriangleList.length == 3) {
                drawLine(document.getElementById(firstPoint.id), document.getElementById(endPoint.id));
                trashLine.length=0;
                isAddTriangle = false;
                const newPointSet = pointTriangleList.slice();
                pointTriangleSets.push(newPointSet);
                pointTriangleList.forEach(item => pointTriangleListTrash.push(item))
                pointTriangleList.length = 0
            }
        }
        if (syllableList.length>0) {
            // Eğer syllableList dolu ise bu kısmı çalıştır
            const syllableListIds = syllableList.map(item => item.id);
    
            pointLineListTrash = pointLineListTrash.filter(item => !syllableListIds.includes(item.id));
            pointTriangleListTrash = pointTriangleListTrash.filter(item => !syllableListIds.includes(item.id));
        }
    }
   
    updateLabelPositions();
});

//dizilerdeki öğeleri siliyor her öğe için ilgili DOM öğesi alınıp (varsa) kaldırılıyor.
cancelButton.addEventListener('click', function () {
    const removeElements = (elements) => {
        elements.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.remove();
            }
        });
    };

    removeElements(pointLineListTrash);
    removeElements(lineList);
    removeElements(pointTriangleListTrash);
    pointTemple4.forEach(item=>{
        removeElements(item)
    })
    pointTemple5.forEach(item=>{
        removeElements(item)
    })
    // Silme işleminden sonra dizileri temizleyin
    lineList.length = 0;
    connectedPoints.length = 0;
    pointTriangleList.length = 0;
    pointTriangleSets.length = 0;
    pointLineSets.length = 0;

    isAddLine = false;
    isAddTriangle = false;

});
function saveTransactions(){
    if(sentenceSets.length==0){
        console.log("boş bu liste")
        
    }
    else{
        var jsonString = JSON.stringify(sentenceSets);
        console.log(jsonString);
    }
}
function changeImage(offset) {
    currentImageIndex += offset;
    if (currentImageIndex > totalImages) {
        currentImageIndex = 1;
    } else if (currentImageIndex < 1) {
        currentImageIndex = totalImages;
    }
    const image = document.getElementById('tablet');
    image.src = `img/tablet${currentImageIndex}.jpeg`;
}

function loadNextImage() {
    changeImage(1);
}

function loadPrevImage() {
    changeImage(-1);
}

function changeZoom(zoomIncrement) {
    if ((zoomIncrement > 0 && zoomLevel < 2) || (zoomIncrement < 0 && zoomLevel > 0.2)) {
        zoomLevel += zoomIncrement;
        tablet.style.transform = `scale(${zoomLevel})`;
        updateLabelPositions();
        updateOriginalCoordinates();
    }
}

function zoomIn() {
    changeZoom(0.1);
}

function zoomOut() {
    changeZoom(-0.1);
}

//TO-DO: fonksiyona gerek var mı kontrol etmek gerekiyor - updateLabelPositions() yüzünden çakışma var mı gibisinden
function updateOriginalCoordinates() {
    const points = document.querySelectorAll('.point');
    points.forEach(function (point) {
        const newX = parseFloat(point.style.left) / zoomLevel;
        const newY = parseFloat(point.style.top) / zoomLevel;
        point.dataset.originalX = newX;
        point.dataset.originalY = newY;
    });
}

// Elementlerin konumunu günceller ve bu güncellemeyi etiket pozisyonlarıyla ve satır pozisyonlarıyla birlikte çağırır.
function updateLabelPositions() {
    updateElementPositions('.point'); // Belirli bir seçiciye göre elementlerin pozisyonunu günceller
    updateLinePositions(); // Satır pozisyonlarını günceller
}
function updateElementPositions(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        // Seçiciye göre elementleri alır ve her birinin pozisyonunu günceller
        const originalX = parseFloat(element.dataset.originalX);
        const originalY = parseFloat(element.dataset.originalY);
        const newX = originalX * zoomLevel;
        const newY = originalY * zoomLevel;
        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
    });
}

// Satır pozisyonlarını günceller
function updateLinePositions() {
    // Satır elementlerini alır ve her birinin pozisyonunu günceller
    const lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        const [x1, y1, x2, y2] = getLineCoordinates(line);
        setPositionAndTransform(line, x1, y1, x2, y2); // Satırın pozisyonunu ayarlar ve döndürür
    });
}
// İki nokta arasında bir çizgi oluşturur
function drawLine(point1, point2) {
    const line = document.createElement("div");
    line.className = 'line'
    line.id = `line-${lineCounter}`
    lineCounter++;
    //to zoom in and out case
    line.dataset.startPoint = point1.id;
    line.dataset.endPoint = point2.id;
    line.style.cssText = `
    position: absolute;
    border: 0.2px solid white;
    background-color: white;
    width: 0.2px;
    height: 0.2px;
    `;
    const [x1, y1] = [parseFloat(point1.dataset.originalX), parseFloat(point1.dataset.originalY)];
    const [x2, y2] = [parseFloat(point2.dataset.originalX), parseFloat(point2.dataset.originalY)];

    setPositionAndTransform(line, x1, y1, x2, y2);

    const lineId = line.id;
    const startId = point1.id;
    const endId = point2.id;
    lineList.push({ id: lineId, startPoint: startId, endPoint: endId });

    container.appendChild(line);
}
// Verilen bir satırın başlangıç ve bitiş noktalarını alır ve onların koordinatlarını döndürür
function getLineCoordinates(line) {
    // Satırın başlangıç ve bitiş noktalarının id'lerini alır
    const startId = line.dataset.startPoint;
    const endId = line.dataset.endPoint;
    const start = document.getElementById(startId);
    const end = document.getElementById(endId);

    // Başlangıç ve bitiş noktalarının koordinatlarını hesaplar ve zoom seviyesine göre yeniden hesaplar
    const [x1, y1] = [parseFloat(start.dataset.originalX) * zoomLevel, parseFloat(start.dataset.originalY) * zoomLevel];
    const [x2, y2] = [parseFloat(end.dataset.originalX) * zoomLevel, parseFloat(end.dataset.originalY) * zoomLevel];

    return [x1, y1, x2, y2];
}
// İki nokta arasında bir çizginin konumunu ve dönüşümünü ayarlar
function setPositionAndTransform(line, x1, y1, x2, y2) {
    line.style.left = (x1 + 2.4) + 'px';
    line.style.top = (y1 + 2.4) + 'px';
    
    const [width, rotation] = calculateWidthAndRotation(x1, y1, x2, y2);
    
    line.style.width = width + 'px';
    line.style.transformOrigin = '0 0';
    line.style.transform = 'rotate(' + rotation + 'rad)';
}

function calculateWidthAndRotation(x1, y1, x2, y2) {
    const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const rotation = Math.atan2(y2 - y1, x2 - x1);
    return [width, rotation];
}
function specialCharCase(event) {
    var clickedChar = event.target.innerText;
    var heceIsmi = document.getElementById('hece_ismi');
    heceIsmi.value += clickedChar;
}

function getSelectedRadioValue(name) {
    const radioButtons = document.getElementsByName(name);
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            return radioButton.value;
        }
    }
    return "";
}

function removeFromTrash(point, trash) {
    const index = trash.findIndex(item => item.id === point.id);
    if (index !== -1) {
        trash.splice(index, 1); // Noktayı trash'ten kaldır
    }
}

function addSyllableCardToList() {
     // Çöp kutusundaki çizgileri ve noktaları kaldırır
    lineList.forEach(line => {
        if (trashLine.includes(line.startPoint)) {
            const lineElement = document.getElementById(line.id);
            if (lineElement) lineElement.remove();
        }
    });

    pointLineList.concat(pointTriangleList).forEach(item => {
        const pointElement = document.getElementById(item.id);
        if (pointElement) pointElement.remove();
    });    
         
    pointLineList.length = 0
    pointTriangleList.length = 0;

     // Gerekli değerlerin kontrolünü yapar ve eksikse uyarı verir
    var heceIsmi = document.getElementById('hece_ismi').value;
    var selectedRadioValue = getSelectedRadioValue('uygarlik');
    if (!heceIsmi || !selectedRadioValue) {
        alert("Hece ismi ve uygarlik seçilmeli");
        return;
    }
    if( (pointTriangleSets.length <= 0 && pointLineSets.length <= 0)){
        alert("Yeni bir Üçgen veya Çizgi eklenemedi ")
    }
    else if (heceIsmi != "" && selectedRadioValue != "" && (pointTriangleSets.length > 0 || pointLineSets.length > 0)) {
        const syllableList = new Set();

        // Nokta listelerini birleştirir ve tekrar edenleri kaldırır
        pointTriangleSets.concat(pointLineSets).forEach(set => {
            set.forEach(point => {
                if (!syllableList.has(JSON.stringify(point))) {
                    syllableList.add(JSON.stringify(point));
                    removeFromTrash(point, point === pointLineSets ? pointLineListTrash : pointTriangleListTrash);
                }
            });
        });

        // Process lineList
        lineList.forEach(line => syllableList.add(JSON.stringify(line)));

        const heceName = { heceIsmi };
        const selectedValue = { selectedRadioValue };
        syllableList.add(JSON.stringify(heceName));
        syllableList.add(JSON.stringify(selectedValue));

        // SyllableList'teki değerleri pointSets'e ekler - point, heceName, selectedValue
        pointSets.push([...syllableList].map(item => JSON.parse(item)));

        pointTriangleSets.length = 0;
        pointLineSets.length = 0;

        const successAlert = document.getElementById("successAlert");
        successAlert.style.display = "block"; // Mesajı görüntüle
        setTimeout(function () {
            successAlert.style.display = "none"; // 2 saniye sonra gizle
        }, 2000); // 2 saniye = 2000 milisaniye
        lineList.length = 0;


        updateSyllableList(); // Hece listesini günceller

        // Gerekli alanları temizler ve radyo düğmesini işaretlenmemiş yapar
        document.getElementById('hece_ismi').value = ""
        var radioButtons = document.getElementsByName("uygarlik");
        for (var i = 0; i < radioButtons.length; i++) {
            radioButtons[i].checked = false;
        }
    }
}

function updateSyllableList() {
    const syllableList = document.getElementById('syllableList');
    syllableList.innerHTML = ''; // Önce mevcut listeyi temizle

    // Her bir pointSet için hece ismini ve seçilen radyo değerini filtreler ve alır
    pointSets.forEach((pointSet, index) => {
        const filteredPointSet = pointSet.filter(point => point.hasOwnProperty('x') && point.hasOwnProperty('y'));
        const heceIsmi = pointSet.find(point => point.hasOwnProperty('heceismi'))?.heceismi || '';
        const selectedRadioValue = pointSet.find(point => point.hasOwnProperty('selectedRadioValue'))?.selectedRadioValue || '';

        // Eğer filtrelenmiş nokta seti boş değilse, yeni bir kart oluşturur ve listeye ekler
        if (filteredPointSet.length > 0) {
            const card = document.createElement('li');
            card.innerHTML = `
                <div class="card mr-3" style="width:175px; height:100px;">
                    <h6 style="font-size:12px;">Hece Seti ${index + 1}</h6>
                    <div style="font-size:12px;">Hece İsmi: ${heceIsmi}</div>
                    <div style="font-size:12px;">Dil: ${selectedRadioValue}</div>
                    <button class="btn-danger" style="width:50px; height:20px; font-size:10px" onclick="deleteCard(${index})">Delete</button> 
                </div>
            `;
            syllableList.appendChild(card);
        }
    });
}

function addWordCard() {
    const wordList = document.getElementById('wordList');
    const kelimeIsmi = document.getElementById('kelime_ismi').value;
  
    if (pointSets.length > 0 && kelimeIsmi != "") {

        // PointSets'teki tüm hece listelerini tek bir liste öğesi olarak wordSets'e ekle
        wordSets.push({ kelime: kelimeIsmi, heceList: [...pointSets] });
        
        // PointSets'i temizle
        pointSets.length = 0;

        // Hece listesini temizle
        const syllableList = document.getElementById('syllableList');
        syllableList.innerHTML = '';

        // Kelime kartlarını oluştur ve listeye ekle
        wordList.innerHTML = ''; // Önce mevcut kelime kartlarını temizle

        wordSets.forEach((word, index) => {
            const card = document.createElement('li');
            card.classList.add('wordCard');

            // Kelimeye ait hece listesini oluşturur
            const heceListItems = word.heceList
                .map((hece, heceIndex) => `<li>Hece ${heceIndex + 1}: Hece İsmi: ${hece[hece.length - 2].heceismi}, Dil: ${hece[hece.length - 1].selectedRadioValue}</li>`)
                .join('');

            // Oluşturulan kartın içeriğini hazırlar ve listeye ekler
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6>Kelime: ${word.kelime}</h6>
                        <ul>${heceListItems}</ul>
                        <button class="btn-danger" style="width:50px; height:20px; font-size:10px" onclick="deleteCardKelime(${index})">Delete</button> 
                    </div>
                </div>
            `;
            wordList.appendChild(card);
        });

        // Kelime giriş alanını temizler
        document.getElementById('kelime_ismi').value = "";
    }
}

function addSentenceCard() {
    const sentencesList = document.getElementById('sentencesList');
    const cumleIsmi = document.getElementById('cumle_ismi').value;

    // Eğer wordSets dizisi doluysa ve cümle ismi boş değilse devam et
    if (wordSets.length > 0 && cumleIsmi != "") {

         // Yeni bir cümle seti oluşturup wordSets'teki kelime listesini kopyala
        sentenceSets.push({ cumleIsmi: cumleIsmi, kelimeList: [...wordSets] });
        wordSets.length = 0;

        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';
        sentencesList.innerHTML = '';

        // Her bir cümle seti için bir kart oluştur ve listeye ekle
        sentenceSets.forEach((sentence, index) => {
            var card = document.createElement('li');
            card.classList.add('sentencesCard');

            // Kelime listesini kart içeriği olarak oluştur
            const wordListItems = sentence.kelimeList
                .map(kelime => `<li><em>${kelime.kelime}</em></li>`)
                .join('');

                card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6>Cumle: ${sentence.cumleIsmi}</h6>
                        <ul>${wordListItems}</ul>
                        <button class="btn-danger" style="width:50px; height:20px; font-size:10px" onclick="deleteCardCumle(${index})">Delete</button>
                    </div>
                </div>
            `;
            sentencesList.appendChild(card);
        });
        // Input alanını temizleme
        document.getElementById('cumle_ismi').value = "";
    }
}

function deleteCard(index) {
    const deletedItems = pointSets[index];

    // Silinecek noktaları ve çizgileri container üzerinden sil
    deletedItems.forEach(item => {
        if (item.hasOwnProperty('x') && item.hasOwnProperty('y')) {
            const pointElement = document.getElementById(item.id);
            if (pointElement) {
                pointElement.remove(); // Noktayı containerdan sil
            }
        } else if (item.hasOwnProperty('startPoint') && item.hasOwnProperty('endPoint')) {
            const lineElement = document.getElementById(item.id);
            if (lineElement) {
                lineElement.remove(); // Çizgiyi containerdan sil
            }
        }
    });

    // Belirli bir "card" ı listeden kaldır
    pointSets.splice(index, 1);

    // Listeyi güncelle
    updateSyllableList();
}

function deleteCardKelime(index) {
    // Eğer verilen index wordSets dizisinin geçerli bir indeksi ise devam et
    if (index >= 0 && index < wordSets.length) {

        // Silinecek öğeleri belirtmek için silinecek öğelerin listesini al
        const deletedItems = wordSets[index].heceList;

        // Her bir öğe için döngü oluştur ve bunları listeden kaldır
        deletedItems.forEach(item => {
            item.forEach(deleteItem => {
                // Silinecek öğelerin her birini bul ve sil
                const element = deleteItem.hasOwnProperty('x') && deleteItem.hasOwnProperty('y')
                    ? document.getElementById(deleteItem.id)
                    : document.getElementById(deleteItem.id);

                if (element) {
                    element.remove();
                }
            });
        });

        // Verilen index'teki öğeyi wordSets dizisinden kaldır
        wordSets.splice(index, 1);

         // Silinen kartı görsel olarak da kaldır
        const card = document.getElementById('wordList').querySelectorAll('.wordCard')[index];
        if (card) {
            card.remove(); // Kartı sil
        }

        addWordCard(); // Kelime kartlarını güncelle
    }
}

function deleteCardCumle(index){
    // Silinecek öğeleri toplamak için boş bir dizi oluştur
    const deletedItems = [];

    // Verilen indeksteki cümle kartının içindeki kelime listesinde dolaş ve hece listelerini deletedItems dizisine ekle
    sentenceSets[index].kelimeList.forEach(item => {
        item.heceList.forEach(subItem => {
            deletedItems.push(subItem);
        });
    });

    // Her bir silinecek öğe için döngü oluştur ve onları listeden kaldır
    deletedItems.forEach(item => {
        item.forEach(deleteItem => {
            const element = deleteItem.hasOwnProperty('x') && deleteItem.hasOwnProperty('y')
                ? document.getElementById(deleteItem.id)
                : document.getElementById(deleteItem.id);

            if (element) {
                element.remove();
            }
        });
    });

    sentenceSets.splice(index, 1);
    const sentencesList = document.getElementById('sentencesList');
    const card = sentencesList.querySelectorAll('.sentencesCard')[index];

    if (card) {
        card.remove();
    }

    addSentenceCard();
}