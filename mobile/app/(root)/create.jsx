import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { API_URL } from '../../constants/api'
import { styles } from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'

const CATEGORIES = [
    { id: "Food & Drinks", name: "Food & Drinks", icon: "fast-food"},
    { id: "Transport", name: "Transport", icon: "car"},
    { id: "Shopping", name: "Shopping", icon: "cart"},
    { id: "Bills", name: "Bills", icon: "receipt"},
    { id: "Entertainment", name: "Entertainment", icon: "film"},
    { id: "Income", name: "Income", icon: "cash"},
    { id: "Education", name: "Education", icon: "school"},
    { id: "Other", name: "Other", icon: "ellipsis-horizontal"}
]

const CreateScreen = () => {
    const router = useRouter();
    const { user } = useUser();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isExpense, setIsExpense] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) return Alert.alert("Error", "Title is required");
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert("Error", "Valid amount is required");
            return;}
        if (!selectedCategory) return Alert.alert("Error", "Category is required");

        setIsLoading(true);
        try {
            const formattedAmount = isExpense ? -parseFloat(amount) : parseFloat(amount);
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userid: user.id,
                    title,
                    amount: formattedAmount,
                    type: selectedCategory,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create transaction");
            }
            Alert.alert("Success", "Transaction created successfully");
            router.back();
        } catch (error) {
            Alert.alert("Error", error.message || "An error occurred while creating the transaction");
            console.error("Create Transaction Error:", error);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text}/>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Transaction</Text>
            <TouchableOpacity
            style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
            onPress={handleCreate}
            disabled={isLoading}>
                <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
                {!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
            </TouchableOpacity>
        </View>
        <View style={styles.card}>
            <View style={styles.typeSelector}>
                <TouchableOpacity style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                onPress={() => setIsExpense(true)}>
                    <Ionicons
                    name='arrow-down-circle'
                    size={22}
                    color={isExpense ? COLORS.white : COLORS.expense}
                    style={styles.typeIcon}/>
                    <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>
                        Expense
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                onPress={() => setIsExpense(false)}>
                    <Ionicons
                    name='arrow-up-circle'
                    size={22}
                    color={!isExpense ? COLORS.white : COLORS.income}
                    style={styles.typeIcon}/>
                    <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
                        Income
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>AED</Text>
                <TextInput
                style={styles.amountInput}
                placeholder='00.00'
                placeholderTextColor={COLORS.textLight}
                value={amount}
                onChangeText={setAmount}
                keyboardType='numeric'/>
            </View>

            <View style={styles.inputContainer}>
                <Ionicons
                name='create-outline'
                size={22}
                color={COLORS.textLight}
                style={styles.inputIcon}/>
                <TextInput
                style={styles.input}
                placeholder='Transaction title'
                placeholderTextColor={COLORS.textLight}
                value={title}
                onChangeText={setTitle}/>
            </View>

            <Text style={styles.sectionTitle}>
                <Ionicons name='pricetag-outline' size={18} color={COLORS.text}/>  Category
            </Text>

            <View style={styles.categoryGrid}>
                {CATEGORIES.map(category => (
                    <TouchableOpacity
                    key={category.id}
                    style={[
                        styles.categoryButton,
                        selectedCategory === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category.id)}>
                        <Ionicons
                        name={category.icon}
                        size={24}
                        color={selectedCategory === category.id ? COLORS.white : COLORS.textLight}/>
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === category.id && styles.categoryButtonTextActive
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        {isLoading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={COLORS.primary}/>
            </View>
        )}

    </View>
  )
}

export default CreateScreen;