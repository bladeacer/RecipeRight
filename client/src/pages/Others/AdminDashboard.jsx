import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import http from '../../http';
import global from '../../global';
import dayjs from 'dayjs';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
    
    users.forEach(user => {
        setDates(dates.push(dayjs(user.createdOn).format('DD-MM-YYYY')))
        setGenders(genders.push(user.genders))
    });
    const genderCounts = genders.reduce((acc, gender) => {
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
    }, {});

    const userRegData = {
        labels: dates,
        datasets: [
            {
                label: 'User Registrations',
                data: dates.map(date => users.filter(user => dayjs(user.createdOn).format('DD-MM-YYYY') === date).length),
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
                data: attributes.map(attr => attr.filter(attr => attr.attributesId === attr.id).length),
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

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <h4 style={{ mb: 4 }}>Admin Dashboard</h4>
            <Bar data={userRegData} options={barConfig1.options} />
            <Pie data={userGenderData} options={pieConfig1.options} />
            <Pie data={resourceTypeData} options={pieConfig2.options} />
            <Pie data={resourceData} options={pieConfig3.options}/>
            <Bar data={attributesData} options={barConfig2.options} />
        </Box>
    );

}

