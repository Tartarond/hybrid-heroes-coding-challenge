import { Card, Title, Paragraph, Chip, Text } from "react-native-paper"
import React, { useState } from "react";
import { StyleSheet, View, Image, NativeSyntheticEvent, ImageLoadEventData} from "react-native"
import { Inventory } from "./store/inventory";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function isProductNewByDate(dateToCheck: Date): boolean {
    const currentDate = new Date(); // Get the current date
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7); // Set to 7 days ago

    return dateToCheck >= sevenDaysAgo && dateToCheck <= currentDate;
}


export default({ record }: { record: Inventory }) => {
    const [expanded, setExpanded] = useState(false);
    const [imageAspectRatio, setImageAspectRatio] = useState(1);

    const categories = record.fields["Product Categories"]?.split(", ")

    Image.getSize(record.fields["Product Image"], (width, height) => {setImageAspectRatio(width/height)}, (_) => {setImageAspectRatio(1)})
    
    return (
        <Card>
            <View style={styles.container}>
                <View style = {styles.imageContainer}>            
                    {record.fields["Product Image"] ? (
                        <Image 
                            source={{ uri: record.fields["Product Image"] }}
                            style={[styles.image, {aspectRatio:expanded ? imageAspectRatio : 1}]}
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name="image-off-outline"
                            color="gray"
                            size={85}
                        />
                    )}
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.titleDateContainer}>
                        <View style={styles.titleRow}>
                            <Text numberOfLines={expanded ? undefined : 1} style={styles.title}>{record.fields["Product Name"]}</Text>
                            <View style={styles.headerIcons}>
                                {isProductNewByDate(new Date(record.fields.Posted)) &&
                                    <MaterialCommunityIcons
                                        name="new-box"
                                        size={24}
                                    />
                                }
                                {expanded ? (
                                    <MaterialCommunityIcons
                                        name="chevron-up"
                                        size={24}
                                        onPress={() => setExpanded(false)}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="chevron-down"
                                        size={24}
                                        onPress={() => setExpanded(true)}
                                    />
                                )}
                            </View>
                        </View>

                        <Text style={styles.date}>
                            {new Date(record.fields.Posted).toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={styles.categoryContainer}>
                        {expanded && categories?.map((category, index) => (
                            <View style={styles.category} key={index}>
                                <Text numberOfLines={1} style={styles.categoryText}>{category}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 8,
        gap: 12
    },
    imageContainer: {
        width: 85,
    },
    image: {
        width: '100%',
        borderRadius: 10,
        marginRight: 5,
    },
    cardContent: {
        flex: 1,
        gap: 12
    },
    titleDateContainer: {
        gap: 2
    },
    titleRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: 'Roboto', 
        fontSize: 20, 
        fontWeight: 900, 
        lineHeight: 22,
        textAlign: 'left',
        flexShrink: 1,
        marginRight: 12
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12
    },
    date: {
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 16,
        textAlign: 'left'
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 6,
        rowGap:4
    },
    category: {
        backgroundColor: '#D4E5FF',
        borderRadius: 48,
        paddingHorizontal: 12,
        paddingVertical: 2
    },
    categoryText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 22,
        textAlign: 'center'
    }
});
