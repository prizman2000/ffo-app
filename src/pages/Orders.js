import React, {useEffect, useState} from 'react';

export const Orders = () => {

    const [data, setData] = useState('');

    function writeOrders() {
        let allOrder = [];
        for (let i = 0; i < localStorage.length; i++) {
            allOrder.push(JSON.parse(localStorage.getItem(i)));
        }
        let result = '';
        for (let i = 1; i < allOrder.length; i++) {
            result += `<tr id=${i}><th scope="row">${i}</th> <td>${allOrder[i].town}</td> <td>${allOrder[i].date}</td> <td>${allOrder[i].time}</td> <td>${allOrder[i].phone}</td> <td>${allOrder[i].name}</td></tr>`;
        }
        setData(result);
    }

    useEffect(() => {
        writeOrders();
    })

    return (
        <div className='container'>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Город</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Время</th>
                    <th scope="col">Телефон</th>
                    <th scope="col">Имя</th>
                </tr>
                </thead>
                <tbody id='table-body' dangerouslySetInnerHTML={{__html: data}}/>
            </table>
        </div>
    );
}