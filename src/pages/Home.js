import React, {useEffect, useState} from 'react';
import {Header} from "../components/Header";
import {Loader} from "../components/Loader";
import {Form} from "../components/Form";
import {Politics} from "../components/Politics";
import {resolveDates, resolveTowns} from "../api";

export const Home = () => {
    const [loading, setLoading] = useState(true);

    let [towns, setTowns] = useState();
    let [dates, setDates] = useState();

    useEffect(() => {
        if(!towns){
            fetch(resolveTowns())
                .then(res => res.json())
                .then(townsData => {
                    const fetchData = fetch(resolveDates(townsData.cities[0].id));
                    return Promise.all([townsData, fetchData.then(res => res.json())]);
                })
                .then(([townsData, datesData]) => {
                    setTowns(townsData.cities);
                    setDates(datesData);
                    setLoading(false);
                })
        }
    },[]);
    return (
        <div className='container w-app pt-5'>
            <Header/>
            {loading ? <Loader/> :
                <div>
                    <Form towns={towns} dates={dates.data}/>
                    <Politics/>
                </div>}
        </div>
    );
}

