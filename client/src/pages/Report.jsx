import { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Report() {

    const [loading, setLoading] = useState(true);
    const [resList, setReslist] = useState([]);
    const [rtList, setRtlist] = useState([]);
    const date = new Date();
    const getRes = () => {
        http.get("/resource").then((res) => {
            setReslist(res.data);
        }).catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });

        ;
    };
    const getRTs = () => {
        http.get("/resourcetype").then((res) => {
            setRtlist(res.data);
        });
    };
    // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 16,
            padding: 16,
            flexGrow: 1
        }
    });

    var MyDocument = () => {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ textAlign: 'center', fontSize: '2.5rem', paddingTop: '40vh', fontWeight: 'extrabold' }}>System snapshot</Text>
                        <Text>&nbsp;</Text>
                        <Text style={{ textAlign: 'center', fontSize: '0.8rem' }}>Updated on: {dayjs(date).format(global.datetimeFormat)}</Text>
                    </View>
                </Page>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'underline' }}>
                            Resources</Text>
                        {resList.reverse().map(x => (
                            <div key={x.resourceId}>
                                <Text>
                                    ID: {x.resourceId.toString()}
                                </Text>
                                <Text>
                                    Name: {x.resourceName}
                                </Text>
                                <Text>
                                    Description: {x.resourceDescription}
                                </Text>
                                <Text>
                                    Type: {rtList.find(y => y.resourceTypeId === x.resourceTypeId).typeName}
                                </Text>
                                <Text>
                                    Created at: {dayjs(x.createdAt).format(global.datetimeFormat)}
                                </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Resources: {resList.length}</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'underline' }}>
                            Resource Types</Text>
                        {rtList.reverse().map(x => (
                            <div key={x.resourceTypeId}>
                                <Text>
                                    ID: {x.resourceTypeId.toString()}
                                </Text>
                                <Text>
                                    Resource Type: {x.typeName}
                                </Text>
                                <Text>
                                    Description: {x.resourceTypeDescription}
                                </Text>
                                <Text>
                                    Created at: {dayjs(x.createdAt).format(global.datetimeFormat)}
                                </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Resource Types: {rtList.length}</Text>
                    </View>
                </Page>
            </Document>
        );
    }
    // Create Document Component
    useEffect(() => {
        getRes();
        getRTs();
        setLoading(false);
    }, []);

    return (
        <>
            {loading && (
                <span aria-busy="true"> Loading...  </span>
            )}
            {!loading && (
                <>
                    <PDFViewer style={{ width: '106%', height: '82.5vh', marginLeft: '-3%' }}>
                        <MyDocument />
                    </PDFViewer>
                    <ToastContainer />
                </>
            )}
        </>
    )
}