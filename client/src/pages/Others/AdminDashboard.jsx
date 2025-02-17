import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import http from '../../http';
import global from '../../global';
import dayjs from 'dayjs';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

export default function AdminDashboard() {

    const [users, setUser] = useState([]);
    const [resList, setReslist] = useState([]);
    const [rtList, setRtlist] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const getUsers = () => {
        http.get("/user").then((res) => {
            console.log(res.data);
            setUser(res.data);
        })
    } 
       const getRes = () => {
        http.get("/resource").then((res) => {
            setReslist(res.data);
        }).catch(function (err) {
            console.error(`${err.response.data.message}`);
        });
    };
    const getRTs = () => {
        http.get("/resourcetype").then((res) => {
            setRtlist(res.data);
        }).catch(function (err) {
            console.error(`${err.response.data.message}`);
        });
    };
    const getAttributes = () => {
        http.get("/attributes").then((res) => {
            setAttributes(res.data);
        }).catch(function (err) {
            console.error(`${err.response.data.message}`);
        });
    };

    useEffect(() => {
        getUsers();
        getAttributes();
        getRes();
        getRTs();
    }, []);
    const [dates, setDates] = useState([]);
    const [genders, setGenders] = useState([]);
    
    useEffect(() => {
        const newDates = users.map(user => dayjs(user.createdOn).format('DD-MM-YYYY'));
        const newGenders = users.map(user => user.gender);
        setDates(newDates);
        setGenders(newGenders);
    }, [users]);

    const genderCounts = genders.reduce((acc, gender) => {
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
    }, {});
    const userRegData = {
        labels: dates,
        datasets: [
            {
                label: 'User Registrations',
                data: Array(dates.length).fill(0),
                fill: false,
                backgroundColor: 'var(--pico-background-orange-450)',
                borderColor: 'var(--pico-color-cyan-950)',
            },
        ],
    };
    const attributesData = {
        labels: attributes.map(attr => attr.attributeName),
        datasets: [
            {
                label: 'Attributes',
                data: Array(attributes.length).fill(0),
                fill: false,
                backgroundColor: 'var(--pico-color-amber-500)',
                borderColor: 'var(--pico-color-cyan-950)',
            },
        ],
    };

    const userGenderData = {
        labels: Object.keys(genderCounts),
        datasets: [
            {
                label: 'User Genders',
                data: Object.values(genderCounts),
                backgroundColor: ['var(--pico-color-fuchsia-500)', 'var(--pico-color-amber-200)', 'var(--pico-color-cyan-450)'],
                hoverOffset: 4
            },
        ],
    };
    const resourceTypeData = {
        labels: rtList.map(rt => rt.typeName),
        datasets: [
            {
                label: 'Resource Types',
                data: rtList.map(rt => rt.filter(res => res.resourceTypeId === rt.id).length),
                fill: false,
                backgroundColor: 'var(--pico-color-amber-500)',
                borderColor: 'var(--pico-color-cyan-950)',
            },
        ],
    };
    const resourceData = {
        labels: resList.map(res => res.typeName),
        datasets: [
            {
                label: 'Resources',
                data: resList.map(res => res.filter(res => res.resourceId === res.id).length),
                fill: false,
                backgroundColor: 'var(--pico-color-amber-500)',
                borderColor: 'var(--pico-color-cyan-950)',
            },
        ],
    };
    const barConfig1 = {
        type: 'bar',
        data: userRegData,
        options: {
            scales: { y: { beginAtZero: true } },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'User Registrations'
                    }
                }
            },
        },
    };
    const pieConfig1 = {
        type: 'pie',
        data: userGenderData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'User Genders'
                }
            }
        },
    };
    const pieConfig2 = {
        type: 'pie',
        data: resourceTypeData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Resource Types'
                }
            }
        },
    };
    const pieConfig3 = {
        type: 'pie',
        data: resourceData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Resource Types'
                }
            }
        },
    };
    const barConfig2 = {
        type: 'bar',
        data: attributesData,
        options: {
            scales: { y: { beginAtZero: true } },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Attributes'
                    }
                }
            },
        },
    };

    ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <h4 style={{ mb: 4 }}>Admin Dashboard</h4>
            {users.length > 0 ? <Bar data={userRegData} options={barConfig1.options} /> : <p>Not available</p>}
            {users.length > 0 ? <Pie data={userGenderData} options={pieConfig1.options} /> : <p>Not available</p>}
            {rtList.length > 0 ? <Pie data={resourceTypeData} options={pieConfig2.options} /> : <p>Not available</p>}
            {resList.length > 0 ? <Pie data={resourceData} options={pieConfig3.options}/> : <p>Not available</p>}
            {attributes.length > 0 ? <Bar data={attributesData} options={barConfig2.options} /> : <p>Not available</p>}
        </Box>
    );

}

