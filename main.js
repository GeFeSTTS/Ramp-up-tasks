const buttonTask1 = document.getElementById('button1');
const placeForTask1 = document.getElementById('task1');
const stringForTask1 = document.getElementById('const-task1');
const buttonTask2 = document.getElementById('button2');
const placeForTask2 = document.getElementById('task2');
const stringForTask2 = document.getElementById('const-task2')
const buttonTask3 = document.getElementById('button3');
const placeForTask3 = document.getElementById('task3');
const stringForTask3 = document.getElementById('const-task3')
const buttonTask4 = document.getElementById('button4');
const placeForTask4 = document.getElementById('task4');

function parse(string) {
    const result = string.textContent.replace(/[$\sA-z]|,\s/gi, ' ').split(' ').filter(item => item.length > 1).reduce(function(acc, cur, i) {
  	acc[i] = cur;
  	return acc;
    }, {})
    console.log(result)
    placeForTask1.innerText = `${JSON.stringify(result)}`
}

function parseValid(string) {
    const array = string.textContent.match(/[A-Z0-9]+/gm);
    const result = JSON.stringify(array)
    console.log(array)
    placeForTask2.innerText = result
}

function parseFourStrings(arr) {
    const arrayWithObj = [];
    const codeNameAndDiscount = {};
    const totalPrice = 150;
    const parsedArr = arr.textContent.match(/\[(.*?)\]/)[0].split("\n");
    const bestCode = {
        bestCode: getBestCode(),
        bestCodeDiscount: getBestCodeDiscount(),
    };
    const total = {originalPrice: totalPrice};
    
    function getPrice () {
        const price = parsedArr.map(str => str.match(/[0-9]*\$/gm).map(item => item.replace('$', ''))).flat();
        return price
    }
    
    function getCodeAndDiscount(){
        const price = getPrice();
        const regEx = new RegExp(/[A-Z]{2,}[0-9]{0,}/gm);
        const discount = [];
        const bonusCode = parsedArr.map(str => str.match(regEx)).filter(str => str != null).flat();
        price.map(el => discount.push(totalPrice - el))
    
        for(let i = 0; i < discount.length; i++){
            for(let j = 0; j < bonusCode.length; j++){
                codeNameAndDiscount[bonusCode[j]] = discount[j];
            }
        }
        return codeNameAndDiscount
    }
    
    function getBestCode() {
        const object = getCodeAndDiscount(),
        keys = Object.keys(object),
        max = keys.reduce(function (a, b) {
            return +object[a] > +object[b] ? a : b;
        }); 
        return max
    }
    
    function getBestCodeDiscount() {
        const price = getPrice();
        return totalPrice - Math.min(...price)
    }
    
    arrayWithObj.push(codeNameAndDiscount, bestCode, total)

    console.log(arrayWithObj)
    placeForTask3.innerText = `${JSON.stringify(arrayWithObj)}`
}

function xmlHttpRequest() {
    let users = []
    let userWithMaxFollowers;
    
    let request = obj => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(obj.method || "GET", obj.url);
            if (obj.headers) {
                Object.keys(obj.headers).forEach(key => {
                    xhr.setRequestHeader(key, obj.headers[key]);
                });
            }
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(obj.body);
        });
    };
    
    Promise.each = async (arr, fn) => {
        for (let item of arr) {
           await fn(item.login, item.followers_url);
        }
    }

    function maxFollowers(arr) {
        let maxNum = arr[0].followers;
        let maxLog = arr[0].login;
        for(let i = 0; i < arr.length; i++) {
            if(maxNum < arr[i].followers) {
                maxNum = arr[i].followers;
                maxLog = arr[i].login;
            }
        }
        userWithMaxFollowers = {person: maxLog,
        followers: maxNum}
        console.log(userWithMaxFollowers);

        placeForTask4.innerText += JSON.stringify(userWithMaxFollowers);
    }
    
    getUser('https://api.github.com/users')
    
    async function getUser(url) {
        let usersAll = await request({url});
        let userArr = JSON.parse(usersAll);
        console.log(userArr)
        return Promise.each(userArr, getFollowers).then(() => maxFollowers(users));
    }
    
    async function getFollowers(userName, userUrl){
        let res = await request({url: userUrl});
        let jsonRes = JSON.parse(res);
        users = [...users, {'login':userName, 'followers':jsonRes.length}];
        return users;
    }
}

buttonTask1.addEventListener("click", function() { parse(stringForTask1)})
buttonTask2.addEventListener("click", function() { parseValid(stringForTask2)})
buttonTask3.addEventListener("click", function() {parseFourStrings(stringForTask3)})
buttonTask4.addEventListener("click", function() {xmlHttpRequest()})