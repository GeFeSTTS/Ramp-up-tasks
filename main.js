const buttonTask1 = document.getElementById('button1');
const placeForTask1 = document.getElementById('task1');
const buttonTask2 = document.getElementById('button2');
const placeForTask2 = document.getElementById('task2');
const buttonTask3 = document.getElementById('button3');
const placeForTask3 = document.getElementById('task3');
const buttonTask4 = document.getElementById('button4');
const placeForTask4 = document.getElementById('task4');

function parse(string) {
    const result = string.replace(/[$\sA-z]|,\s/gi, ' ').split(' ').filter(item => item.length > 1).reduce(function(acc, cur, i) {
  	acc[i] = cur;
  	return acc;
    }, {})
    console.log(result)
    placeForTask1.innerText = `${JSON.stringify(result)}`
}

function parseValid(string) {
    const array = string.match(/[A-Z0-9]+/gm);
    const result = JSON.stringify(array)
    console.log(array)
    placeForTask2.innerText = result
}

function parseFourStrings(arr) {
    const arrayWithObj = [];
    const codeNameAndDiscount = {};
    const bestCode = {
        bestCode: getBestCode(),
        bestCodeDiscount: getBestCodeDiscount(),
    };
    const total = {originalPrice: getTotal()};
    
    function getTotal () {
        return arr.find(item => item.match(/total/)).match(/\d+/)[0];
    }
    
    function getPrice () {
        const price = arr.map(str => str.match(/[0-9]*\$/gm)[0]).map(item => item.replace('$', ''));
        return price.splice(0, price.length-1)
    }
    
    function getCodeAndDiscount(){
        const price = getPrice();
        const regEx = new RegExp(/[A-Z]{2,}[0-9]{0,}/gm);
        const discount = [];
        const bonusCode = arr.map(str => str.match(regEx)).filter(str => str != null).flat();
    
        price.map(el => discount.push(getTotal() - el))
    
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
        return getTotal() - Math.min(...price)
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

buttonTask1.addEventListener("click", function() { parse('$1.99, $ 222000.00, $ 1,000.99, 555.44 USD')})
buttonTask2.addEventListener("click", function() { parseValid(`SAVE50 is not valid
1223ABC456 is not valid
JSKFSDKFJH is not valid
100OFF is not applied
JANNU11 is applied`)})
buttonTask3.addEventListener("click", function() {parseFourStrings(["Code 'GENIECODE0' is applied to your cart, Total price is: 90$", "Code 'GENIECODE1' is applied to your cart, Total price is: 80$", "Code 'GENIECODE2' is applied to your cart, Total price is: 70$", "The total price is: 150$"])})
buttonTask4.addEventListener("click", function() {xmlHttpRequest()})