import { Card, Title, Paragraph, Chip, Text } from "react-native-paper"
import React, { useState } from "react";
import { StyleSheet, View, Image, NativeSyntheticEvent, ImageLoadEventData} from "react-native"
import { Inventory } from "./store/inventory";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function isProductNewByDate(dateToCheck: Date): boolean {
    // Get the current date
    const currentDate = new Date(); 
    const sevenDaysAgo = new Date(currentDate);
    // Set to 7 days ago
    sevenDaysAgo.setDate(currentDate.getDate() - 7); 

    // Check if the given date is not in the future and maximum seven days in the past
    return dateToCheck >= sevenDaysAgo && dateToCheck <= currentDate;
}


export default({ record }: { record: Inventory }) => {
    // Hook to store if the Card is expanded
    const [expanded, setExpanded] = useState(false);

    // Get the images aspect ratio and store it in the hook
    const [imageAspectRatio, setImageAspectRatio] = useState(1);
    Image.getSize(record.fields["Product Image"], (width, height) => {setImageAspectRatio(width/height)}, (_) => {setImageAspectRatio(1)})

    // Convert category array to a string
    const categories = record.fields["Product Categories"]?.split(", ")
    
    return (
        <View style={styles.cardContainer}>
            {/* This container contains either the product image or a fallback icon */}
            <View style = {styles.imageContainer}>
                {record.fields["Product Image"] ? (
                    <Image 
                        source={{ uri: record.fields["Product Image"] }}
                        // dynamically set the aspect ratio
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

            {/* The rest of the card content */}
            <View style={styles.cardContent}>
                {/* The title row and the date of the component */}
                <View style={styles.titleDateContainer}>
                    {/* The title row contains the title of the card, possibly a new icon and the expand/collapse button */}
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

                    {/* the date on which the product was added */}
                    <Text style={styles.date}>
                        {new Date(record.fields.Posted).toLocaleDateString()}
                    </Text>
                </View>

                {/* The container containing the category tags */}
                <View style={styles.categoryContainer}>
                    {expanded && categories?.map((category, index) => (
                        <View style={styles.category} key={index}>
                            <Text numberOfLines={1} style={styles.categoryText}>{category}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        padding: 8,
        gap: 12,
        borderRadius: 4,
        backgroundColor: '#F8F9FC',
        shadowColor: '#1B263340',
        // iOS shadow properties
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        // Android shadow property
        elevation: 3,
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
