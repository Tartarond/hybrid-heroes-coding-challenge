import { Text, Card, Title } from "react-native-paper"
import React from "react";
import { Inventory } from "./store/inventory";

export default({ record }: { record: Inventory }) => {
    return (
        <Card>
            <Card.Content>
                <Title>{record.fields["Product Name"]}</Title>
            </Card.Content>
        </Card>
    )
}