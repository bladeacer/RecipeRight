import { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Error from './Error';

export default function Report() {

    const [loading, setLoading] = useState(true);
    const [resList, setReslist] = useState([]);
    const [rtList, setRtlist] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [userAttrs, setUserAttrs] = useState([]);
    const [wasteList, setWasteList] = useState([]);
    const [goalList, setGoalList] = useState([]);
    const [badgeList, setBadgeList] = useState([]);
    const [fridgeItems, setFridgeItems] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);

    const [isAllowedViewReport, setIsAllowedViewReport] = useState(false);
    const [users, setUser] = useState([]);

    const date = new Date();
    const getUsers = () => {
        http.get("/user").then((res) => {
            console.log(res.data);
            setUser(res.data.user);
        })
    }
    const getRes = () => {
        http.get("/resource").then((res) => {
            setReslist(res.data);
        }).catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });
    };
    const getRTs = () => {
        http.get("/resourcetype").then((res) => {
            setRtlist(res.data);
        }).catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });
    };
    const getAttributes = () => {
        http.get("/attributes").then((res) => {
            setAttributes(res.data);
        }).catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });
    };
    const getUserAttrs = () => {
        http.get("/userattributes").then((res) => {
            setUserAttrs(res.data);
            console.log(res.data);
        }).catch(function (err) {
            toast.error(`${err.response.data.message}`);
        });
    };

    const getWasteEntries = () => {
        http.get("/foodWasteEntry").then((res) => {
            console.log(res.data);  // Add this line
            setWasteList(res.data);
        });
    };
    const getGoals = () => {
        http.get("/sustainabilityGoal").then((res) => {
            console.log(res.data);
            setGoalList(res.data);
        });
    };
    const getBadges = () => {
        http.get("/sustainabilityBadge").then((res) => {
            setBadgeList(res.data);
            console.log(res.data);
        });
    };
    const fetchFridgeItems = async () => {
        try {
            const response = await http.get("/api/Fridge");
            setFridgeItems(response.data);
        } catch (err) {
            console.error("Error fetching fridge items:", err);
        }
    };

    // Fetch bookmarks grouped by folders
    const fetchBookmarks = async () => {
        try {
            const response = await http.get("/api/Bookmarks");
            setBookmarks(response.data);
        } catch (err) {
            console.error("Error fetching bookmarks:", err);
        }
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


    useEffect(() => {
        Promise.all([
            http.get("/userattributes/attr?attribute=admin"),
            http.get(`/userattributes/attr?attribute=view_report`)
        ]).then(([adminRes, viewReportRes]) => {
            if (adminRes.data == true) {
                setIsAllowedViewReport(true)
            }
            else {
                setIsAllowedViewReport(viewReportRes.data)
            }
            console.log(viewReportRes.data);
            console.log(adminRes.data);
        });
        getRes();
        getRTs();
        getAttributes();
        getUserAttrs();
        getWasteEntries();
        getGoals();
        getBadges();
        fetchBookmarks();
        fetchFridgeItems();
        getUsers();
        setLoading(false);
    }, []);

    var MyDocument = () => {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ textAlign: 'center', fontSize: '2.5rem', paddingTop: '40vh', fontWeight: 'extraultrabold' }}>System snapshot</Text>
                        <Text>&nbsp;</Text>
                        <Text style={{ textAlign: 'center', fontSize: '0.8rem' }}>Updated on: {dayjs(date).format(global.datetimeFormat)}</Text>
                    </View>
                </Page>

                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ textAlign: 'center', fontSize: '2.5rem', paddingTop: '40vh', fontWeight: 'extraultrabold' }}>Admin</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Resources</Text>
                        {resList.reverse().map(x => (
                            <div key={x.resourceId}>
                                <Text> ID: {x.resourceId} </Text>
                                <Text> Name: {x.resourceName} </Text>
                                <Text> Description: {x.resourceDescription} </Text>
                                <Text> Type: {rtList.find(y => y.resourceTypeId === x.resourceTypeId).typeName} </Text>
                                <Text> Created at: {dayjs(x.createdAt).format(global.datetimeFormat)} </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Resources: {resList.length}</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Resource Types</Text>
                        {rtList.reverse().map(x => (
                            <div key={x.resourceTypeId}>
                                <Text> ID: {x.resourceTypeId} </Text>
                                <Text> Resource Type: {x.typeName} </Text>
                                <Text> Description: {x.resourceTypeDescription} </Text>
                                <Text> Created at: {dayjs(x.createdAt).format(global.datetimeFormat)} </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Resource Types: {rtList.length}</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Attributes</Text>
                        {attributes.reverse().map(x => (
                            <div key={x.attributesId}>
                                <Text> ID: {x.attributesId} </Text>
                                <Text> Name: {x.attributeName} </Text>
                                <Text> Description: {x.attributeDescription} </Text>
                                <Text> Created at: {dayjs(x.createdAt).format(global.datetimeFormat)} </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Attributes: {attributes.length}</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>User Attributes</Text>
                        {userAttrs.reverse().map(x => (
                            <div key={x.userAttributesId}>
                                <Text> ID: {x.userAttributesId} </Text>
                                <Text> Name: {x.userAttributeName} </Text>
                                <Text> Description: {x.userAttributeDescription} </Text>
                                <Text> Created at: {dayjs(x.createdAt).format(global.datetimeFormat)} </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Attributes: {userAttrs.length}</Text>
                    </View>
                </Page>


                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ textAlign: 'center', fontSize: '2.5rem', paddingTop: '40vh', fontWeight: 'extraultrabold' }}>Sustainability</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Food Waste Entries</Text>
                        {wasteList.reverse().map(x => (
                            <div key={x.foodWasteEntryId}>
                                <Text> ID: {x.foodWasteEntryId} </Text>
                                <Text> Waste Reason: {x.wasteReason} </Text>
                                <Text> Waste Amount: {x.wasteAmount} kg </Text>
                                <Text> Logged on: {dayjs(x.loggedOn).format(global.datetimeFormat)} </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Waste Entries: {wasteList.length}</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Sustainability Goals</Text>
                        {goalList.reverse().map(x => (
                            <div key={x.sustainabilityGoalId}>
                                <Text> ID: {x.sustainabilityGoalId} </Text>
                                <Text> Goal Name: {x.goalName} </Text>
                                <Text> Target Value: {x.targetValue} </Text>
                                <Text> Current Value: {x.currentValue} </Text>
                                <Text> Created on: {dayjs(x.createdOn).format(global.datetimeFormat)} </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Goals: {goalList.length}</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Sustainability Badges</Text>
                        {badgeList.reverse().map(x => (
                            <div key={x.badgeId}>
                                <Text> ID: {x.badgeId} </Text>
                                <Text> Badge Name: {x.badgeName} </Text>
                                <Text> Awarded on: {dayjs(x.awardedOn).format(global.datetimeFormat)} </Text>
                                <Text> Description: {x.badgeDescription} </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Badges: {badgeList.length}</Text>
                    </View>
                </Page>

                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ textAlign: 'center', fontSize: '2.5rem', paddingTop: '40vh', fontWeight: 'extraultrabold' }}>Recipe</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Fridge Items</Text>
                        {fridgeItems.map((item) => (
                            <div key={item.id}>
                                <Text>Ingredient Name: {item.ingredientName}</Text>
                                <Text>Quantity: {item.quantity}</Text>
                                <Text>Unit: {item.unit}</Text>
                                <Text>Expiry Date: {item.expiryDate}</Text>
                            </div>
                        ))}
                        <Text>Number of Fridge Items: {fridgeItems.length}</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Bookmarked Recipes</Text>
                        {bookmarks.length === 0 ? (
                            <p>You have no bookmarks.</p>
                        ) : (
                            bookmarks.map((folder) => (
                                <div key={folder.name} className="bookmark-folder">
                                    <Text>{folder.name}</Text>
                                    {folder.recipes.map((recipe) => (
                                        <div key={recipe.recipeId} >
                                            <Image src={recipe.image} alt={recipe.title} className="bookmark-image" />
                                            <Text>{recipe.title}</Text>
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </View>
                </Page>

                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ textAlign: 'center', fontSize: '2.5rem', paddingTop: '40vh', fontWeight: 'extraultrabold' }}>Users</Text>
                    </View>
                </Page>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: '1.1rem' }}>Users</Text>
                        {users.map(x => (
                            <div key={x.userId}>
                                <Text> ID: {x.userId} </Text>
                                <Text> Username: {x.username} </Text>
                                <Text> Email: {x.email} </Text>
                                <Text>Gender: {x.gender} </Text>
                                <Text> Created on: {dayjs(x.createdAt).format(global.datetimeFormat)} </Text>
                                <Text>&nbsp;</Text>
                            </div>
                        ))}
                        <Text>Number of Users: {users.length}</Text>
                    </View>
                </Page>

            </Document>
        );
    }



    return (
        <>
            {loading && (
                <span aria-busy="true"> Loading...  </span>
            )}

            {(!loading && isAllowedViewReport) && (
                <PDFViewer style={{ width: '106%', height: '82.5vh', marginLeft: '-3%' }}>
                    <MyDocument />
                </PDFViewer>
            )}
            {!loading && !isAllowedViewReport && (
                <Error />
            )}
            <ToastContainer />
        </>
    )
}