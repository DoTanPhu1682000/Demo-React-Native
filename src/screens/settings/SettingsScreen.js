import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { getData, getUserData, getCategoriesData } from "../../redux/actions/updateAction";

export default SettingsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { data, error } = useSelector((state) => state.infoReducer);
    const { dataUser, errorUser } = useSelector((state) => state.infoReducer);
    const { categoriesData, errorCategories } = useSelector((state) => state.categoryReducer);

    useEffect(() => {
        // Gọi action để lấy dữ liệu từ API khi component được mount
        dispatch(getData())
        dispatch(getUserData())
        dispatch(getCategoriesData())
    }, []);

    // if (error) {
    //     return <Text>Error: {error}</Text>;
    // }

    // if (!data) {
    //     return <Text>Loading...</Text>;
    // }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', backgroundColor: "#FFFFFF" }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 24 }}>Setting</Text>
                <Text>ID: {data === null ? <Text>Loading...</Text> : data.id}</Text>
                <Text>Name: {data === null ? <Text>Loading...</Text> : data.name}</Text>
            </View>

            <View style={{ alignItems: "center", justifyContent: "center", margin: 20 }}>
                <FlatList
                    data={dataUser}
                    renderItem={({ item }) => (
                        <View>
                            <Text>ID: {item.id}</Text>
                            <Text>Name: {item.name}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()} />
            </View>

            <View style={styles.container}>
                <FlatList
                    data={categoriesData}
                    style={{ width: '100%', margin: 20 }}
                    renderItem={({ item }) => (
                        <View>
                            <Text>ID: {item.idCategory}</Text>
                            <Text>Name: {item.strCategory}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.idCategory} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});