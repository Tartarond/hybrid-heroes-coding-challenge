import React, { useRef, useState } from "react";
import { StyleSheet, View, Image, TouchableHighlight, LayoutChangeEvent, Animated } from "react-native";
import { Text } from "react-native-paper"
import { Inventory } from "./store/inventory";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Checks, if a product was added in the last seven days
function isNewProductByDate(dateToCheck: Date): boolean {
    // Get the current date
    const currentDate = new Date(); 
    const sevenDaysAgo = new Date(currentDate);
    // Set to 7 days ago
    sevenDaysAgo.setDate(currentDate.getDate() - 7); 

    // Check if the given date is not in the future and maximum seven days in the past
    return dateToCheck >= sevenDaysAgo && dateToCheck <= currentDate;
}

export default React.memo(({ inventory }: { inventory: Inventory }) => {
    // Hook to store if the Card is expanded
    const [expanded, setExpanded] = useState(false);
    const [titleTruncated, setTitleTruncated] = useState(true)

    // Get the images aspect ratio and store it in the hook
    const [imageAspectRatio, setImageAspectRatio] = useState(1);
    Image.getSize(inventory.fields["Product Image"], (width, height) => {setImageAspectRatio(width/height)}, (_) => {setImageAspectRatio(1)})

    // Convert category array to a string
    const categories = inventory.fields["Product Categories"]?.split(", ")

    // The height of the categories container
    const [categoriesHeight, setCategoriesHeight] = useState(0)
    
    // This value is animated between 0 and 1
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Expands/Collapses the card
    const toggleCard = () => {
        if(expanded) {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
              }).start(() => {
                // This callback runs when the animation completes
                setTitleTruncated(!titleTruncated)
              });
        } else {
            setTitleTruncated(!titleTruncated)
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
              }).start();
        }
        setExpanded(!expanded)
    };

    // Dynamically get the height of the categories container
    const CategoriesLayout = (event: LayoutChangeEvent) => {
        const layoutHeight = event.nativeEvent.layout.height

        if (layoutHeight > 0 && layoutHeight !== categoriesHeight) {
            setCategoriesHeight(layoutHeight)
        }
    }
    
    return (
        // Touchable component to handle press event
        <TouchableHighlight style={styles.touchable} onPress={toggleCard} underlayColor="gray">
            <View style={styles.cardContainer}>
                {/* This container contains either the product image or a fallback icon */}
                <View style = {styles.imageContainer}>
                    {inventory.fields["Product Image"] ? (
                        <Animated.Image 
                            source={{ uri: inventory.fields["Product Image"] }}
                            // dynamically set the aspect ratio
                            style={[
                                styles.image, 
                                {aspectRatio: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, imageAspectRatio]
                                })}
                            ]}
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
                            <Animated.View 
                                style={{
                                    flexShrink: 1,
                                    maxHeight: animatedValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [24, 240]
                                    })
                                }}
                                >
                                    <Text numberOfLines={titleTruncated ? 1 : 10} style={styles.title}>{inventory.fields["Product Name"]}</Text>
                            </Animated.View>
                            
                            <View style={styles.headerIcons}>
                                {isNewProductByDate(new Date(inventory.fields.Posted)) &&
                                    <MaterialCommunityIcons
                                        name="new-box"
                                        size={24}
                                    />
                                }
                                <MaterialCommunityIcons
                                    name={expanded ? "chevron-up": "chevron-down"}
                                    size={24}
                                />
                            </View>
                        </View>

                        {/* the date on which the product was added */}
                        <Text style={styles.date}>
                            {new Date(inventory.fields.Posted).toLocaleDateString()}
                        </Text>
                    </View>

                    {/* The container containing the category tags */}
                    <Animated.View 
                        style={{
                            overflow: 'hidden',
                            height: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, categoriesHeight]
                            })
                        }}>
                        <View style={styles.categoryContainer} onLayout={CategoriesLayout}>
                            {categories?.map((category, index) => (
                                <View style={styles.category} key={index}>
                                    <Text numberOfLines={1} style={styles.categoryText}>{category}</Text>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                </View>
            </View>
        </TouchableHighlight>
    )
})

const styles = StyleSheet.create({
    touchable: {
        borderRadius: 4
    },
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
        marginRight: 12,
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
        rowGap: 4,
        position: 'absolute'
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
