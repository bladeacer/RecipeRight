import { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

export default function Report() {

    const [loading, setLoading] = useState(true);
    const [resList, setReslist] = useState([]);
    const [rtList, setRtlist] = useState([]);
    const date = new Date();
    const getRes = () => {
        http.get("/resource").then((res) => {
            setReslist(res.data);
        });
    };
    const getRTs = () => {
        http.get("/resourcetype").then((res) => {
            setRtlist(res.data);
            // console.log(res.data);
        });
    };
    // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    var MyDocument = () => {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                    <Text style={{textAlign: 'center', fontSize: '2.5rem', paddingTop: '40vh', fontWeight: 'extrabold'}}>System snapshot</Text>
                    <Text>&nbsp;</Text>
                    <Text style={{textAlign: 'center', fontSize: '0.8rem'}}>Updated on: {dayjs(date).format(global.datetimeFormat)}</Text>
                    </View>
                </Page>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{fontWeight: 'bold', fontSize: '1.05rem', textDecoration: 'underline'}}>Resources</Text>
                        {resList.map(x => (
                            <>
                                <Text key={x.resourceId}>
                                    Name: {x.resourceName}
                                </Text>
                                <Text>
                                    Description: {x.resourceDescription}
                                </Text>
                                <Text>
                                    Created at: {dayjs(x.createdAt).format(global.datetimeFormat)}
                                </Text>
                                <Text>&nbsp;</Text>
                            </>
                        ))}
                        <Text>&nbsp;</Text>
                        <Text style={{fontWeight: 'bold', fontSize: '1.05rem', textDecoration: 'underline'}}>Resource Types</Text>
                        {rtList.map(x => (
                            <>
                                <Text key={x.resourceTypeId}>
                                    Resource Type: {x.typeName}
                                </Text>
                                <Text>
                                    Description: {x.resourceTypeDescription}
                                </Text>
                                <Text>
                                    Created at: {dayjs(x.createdAt).format(global.datetimeFormat)}
                                </Text>
                                <Text>&nbsp;</Text>
                            </>
                        ))}
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
                <PDFViewer style={{ width: '100%', height: '82.5vh' }}>
                    <MyDocument />
                </PDFViewer>
            )}
        </>
    )
}