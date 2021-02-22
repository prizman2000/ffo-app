import React, {useState} from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {resolveDates} from "../api";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

function writePhones(props) {
    let result = '';
    for (let i = 0; i < props.length; i++) {
        result += `<a href="#">+${props[i]}</a>, `;
    }
    result = result.slice(0, result.length - 2);
    return result;
}

export const Form = ({towns, dates}) => {

    let currentMainInfo = {
        id: towns[0].id,
        name: towns[0].name,
        address: towns[0].address,
        phones: towns[0].phones,
        price: towns[0].price
    };

    let currentDays = [];
    let currentTime = [];

    const optionsDay = {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    };

    for (const prop in dates) {
        let isActualDay = false;
        for (const prp in dates[prop]) {
            if (!dates[prop][prp].is_not_free) {
                isActualDay = true;
            }
        }
        if (isActualDay) {
            let a = new Date(prop);
            currentDays.push({value: prop, label:a.toLocaleString('ru', optionsDay)});
            //currentDays.push({value:prop, label:prop});
        }
        isActualDay = false;
    }

    const [infoTime, setInfoTime] = useState(currentTime);  //Состояние времени относительно даты
    const [info, setInf] = useState(currentMainInfo);     //Состояние информации о городе

    const [infoDates, setInfoDates] = useState(currentDays);
    const [datesInfo, setDatesInfo] = useState(dates);


    let townsList = [];

    for (let i = 0; i < towns.length; i++) {
        townsList.push({label: towns[i].name, value: towns[i].id});
    }

    function changeInfoDates(prop) {
        fetch(resolveDates(prop.value))
            .then(res => res.json())
            .then(datesData => {
                setDatesInfo(datesData.data)
                currentDays = [];
                for (const prop in datesData.data) {
                    let isActualDay = false;
                    for (const prp in datesData.data[prop]) {
                        if (!datesData.data[prop][prp].is_not_free) {
                            isActualDay = true;
                        }
                    }
                    if (isActualDay) {
                        let a = new Date(prop);
                        currentDays.push({value: prop, label: a.toLocaleString('ru', optionsDay)});
                        //currentDays.push(prop);
                    }
                    isActualDay = false;
                }
                setInfoDates(currentDays);
            })
    }

    function changeInfo(prop) {
        let date = document.getElementsByClassName('is-selected')[1];
        let time = document.getElementsByClassName('is-selected')[2];
        if(date){
            date.innerText = 'Дата';
        }
        if (time){
            time.innerText = 'Время';
        }
        for (let i = 0; i < towns.length; i++) {
            if (towns[i].id === prop.value) {
                return towns[i];
            }
        }
    }

    const clearFieldTime = () => document.getElementById('time-error').innerText = '';
    const clearFieldPhone = () => document.getElementById('phone-error').innerText = '';
    const clearFieldName = () => document.getElementById('name-error').innerText = '';

    function getInfoTime(props) {
        document.getElementById('date-error').innerText = '';
        let toClear = document.getElementsByClassName('is-selected')[3];
        if (toClear) {
            toClear.innerText = 'Время';
        }
        let result = [];
        for (const prop in datesInfo) {
            for (const prp in datesInfo[prop]) {
                if (props.value === datesInfo[prop][prp].day && !datesInfo[prop][prp].is_not_free) {
                    result.push(datesInfo[prop][prp].begin + '-' + datesInfo[prop][prp].end);
                }
            }
        }
        return result;
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let applyObj = {}; // town, date, time, phone, name

    function apply(){
        applyObj.town = document.getElementsByClassName('is-selected')[0].innerText;
        applyObj.date = document.getElementsByClassName('is-selected')[1];
        applyObj.time = document.getElementsByClassName('is-selected')[2];
        applyObj.phone = document.getElementById('phone').value;
        applyObj.name = document.getElementById('name').value;
        let valid = true;
        if(!applyObj.date){
            document.getElementById('date-error').innerText = 'Пожалуйста, выберите дату';
            valid = false;
        }else {
            applyObj.date = applyObj.date.innerText;
        }
        if(!applyObj.time){
            document.getElementById('time-error').innerText = 'Пожалуйста, выберите время';
            valid = false;
        }else {
            applyObj.time = applyObj.time.innerText;
        }
        if(applyObj.phone.length === 0){
            document.getElementById('phone-error').innerText = 'Пожалуйста, введите корректный телефон, иначе наши специалисты не смогут связаться с вами';
            valid = false;
        }
        if(applyObj.name.length === 0){
            document.getElementById('name-error').innerText = 'Пожалуйста, укажите имя';
            valid = false;
        }

        if (valid){
            if(localStorage.getItem(0) === null){
                localStorage.setItem(0, 1);
                localStorage.setItem(localStorage.getItem(0), JSON.stringify(applyObj))
            }else{
                localStorage.setItem(0, parseInt(localStorage.getItem(0))+1);
                localStorage.setItem(localStorage.getItem(0), JSON.stringify(applyObj));
            }

            handleShow();
            document.getElementsByClassName('is-selected')[1].innerText = 'Дата';
            document.getElementsByClassName('is-selected')[2].innerText = 'Время';
            document.getElementById('phone').value = '';
            document.getElementById('name').value = '';
        }
    }

    return (
        <form className='pt-3'>
            <div className="mb-3">
                <Dropdown options={townsList} value={info.name} onChange={res => {
                    setInf(changeInfo(res));
                    changeInfoDates(res)
                }}/>
            </div>
            <div className="mb-3 pl-3 small-text">
                <div>{info.address}</div>
                <div dangerouslySetInnerHTML={{__html: writePhones(info.phones)}}/>
                <div>Стоимость услуги {info.price}</div>
            </div>
            <div className="mb-3 input-group moment">
                <div className='date'><Dropdown options={infoDates} onChange={res => {
                    setInfoTime(getInfoTime(res))
                }} placeholder='Дата'/>
                    <div id='date-error' className='text-danger small-text'/>
                </div>
                <div className='time'><Dropdown className='clear-time' options={infoTime} onChange={clearFieldTime} placeholder='Время'/>
                    <div id='time-error' className='text-danger small-text'/>
                </div>
            </div>
            <div className="mb-3">
                <input type="phone" onChange={clearFieldPhone} id='phone' className="form-control bg-input" placeholder='+7(___)___-__-__'/>
                <div id='phone-error' className='text-danger small-text'/>
            </div>
            <div className="mb-3">
                <input type="name" onChange={clearFieldName} id='name' className="form-control bg-input" placeholder="Ваше имя"/>
                <div id='name-error' className='text-danger small-text'/>
            </div>
            <div className='w-100 text-center'>
                <div  onClick={apply}
                        className="btn btn-secondary font-weight-bold">Записаться
                </div>
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Заявка успешно создана!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Если вы забыли данные своей заявки то ее можно найти в разделе "Заявки".
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </form>
    );
}