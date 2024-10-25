import { Card, Title, Paragraph, Chip } from "react-native-paper"
import React, { useState } from "react";
import { StyleSheet, View, Image} from "react-native"
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

    const categories = record.fields["Product Categories"]?.split(", ")

    return (
        <Card style={styles.card}>
            <View style={styles.container}>
                <View style = {styles.imageContainer}>            
                    {record.fields["Product Image"] ? (
                        <Image 
                            source={{ uri: record.fields["Product Image"] }}
                            style={styles.image}
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name="image-off-outline"
                            color="gray"
                            size={80}
                        />
                    )}
                </View>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.titleRow}>
                        <Title numberOfLines={expanded ? undefined : 1} style={styles.title}>{record.fields["Product Name"]}</Title>
                        <View style={styles.headerIcons}>
                            {isProductNewByDate(new Date(record.fields.Posted)) &&
                                <MaterialCommunityIcons
                                    name="new-box"
                                    size={30}
                                />
                            }
                            {expanded ? (
                                <MaterialCommunityIcons
                                    name="chevron-up"
                                    size={30}
                                    onPress={() => setExpanded(false)}
                                />
                            ) : (
                                <MaterialCommunityIcons
                                    name="chevron-down"
                                    size={30}
                                    onPress={() => setExpanded(true)}
                                />
                            )}
                        </View>
                    </View>

                    <Paragraph>
                        {new Date(record.fields.Posted).toLocaleDateString()}
                    </Paragraph>

                    <View style={styles.categoryContainer}>
                        {expanded && categories?.map((category, index) => (
                            <Chip style={styles.category} key={index}>
                                {category}
                            </Chip>
                        ))}
                    </View>

                </Card.Content>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        margin: 5
    },
    container: {
        flexDirection: 'row'
    },
    imageContainer: {
        width: 80,
        aspectRatio: 1
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        marginRight: 5,
    },
    cardContent: {
        flex: 1,
        padding: 10
    },
    titleRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    title: {
        marginRight: 10,
        flexShrink: 1
    },
    headerIcons: {
        flexDirection: 'row'
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    category: {
        margin: 2
    }
});
