
const controller = fileName => {
    return fetch(`data/${fileName}.json`)
        .then(response => response.json())
}

function getCurrency(data) {
    let currency;
    do {
        let userCurrency = Object.keys(data);
        currency = prompt(`Оберіть валюту у форматі: ${userCurrency.join(", ")}!`).replaceAll(" ", "").toUpperCase();
    } while (!data[currency]);

    return currency;
}

let getAmountOfMoney = () => prompt(`Введіть суму зняття:`);

function getMoney(userData, bankData) {
    
    let addConfirm = confirm(`Переглянути баланс картки?`);

    if (addConfirm) {
        controller(userData)
            .then(userData => {
                let userDataValue;
                for (const key in userData) {
                    userDataValue = userData[key];
                } 
                return userDataValue; 
            })
            .then(userDataValue => {
                let currency = getCurrency(userDataValue);
                alert(`Баланс складає: ${userDataValue[currency]} ${currency}.`);
                alert('Дякуємо, гарного дня☺️!');
            })
            
    } else if (!addConfirm) {
        return Promise.all([
            controller(userData),
            controller(bankData),
        ])
        .then(data => {
            let userData;
            let bankData;

            data.map(dataValue => dataValue.userData ? userData = dataValue.userData : bankData = dataValue.bankData);

            let currency = getCurrency(userData);

            while (!bankData[currency] || bankData[currency].max === 0) {
                alert(`Валюта ${currency} відсутня у банкоматі, оберіть іншу валюту.`);
                currency = getCurrency(userData);
            }

            let amount = getAmountOfMoney();

            while (userData[currency] < amount) {
                alert(`На рахунку не достатньо коштів. Ведіть іншу суму.`);
                amount = getAmountOfMoney();
            }

            while (bankData[currency].max < amount) {
                alert(`Введена сума більша за допустиму. Максимальна сума зняття: ${bankData[currency].max}`);
                amount = getAmountOfMoney();
            }

            while (bankData[currency].min > amount) {
                alert(`Введена сума менша за допустиму. Мінімальна сума зняття: ${bankData[currency].min}`);
                amount = getAmountOfMoney();
            }
            
            alert(`Візьіть Ваші гроші: ${amount} ${currency} ${bankData[currency].img}`);
            alert('Дякуємо, гарного дня☺️!')
        })
    }
}

getMoney("userData", "bankData");