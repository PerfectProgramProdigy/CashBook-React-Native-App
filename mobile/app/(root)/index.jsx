import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, View, Image, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useEffect, useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import PageLoad from '../../components/PageLoad'
import { BalanceCard } from '../../components/BalanceCard'
import { TransactionItem } from '../../components/TransactionItem'
import { styles } from '../../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import NoTransactionsFound from '../../components/NoTransactionsFound';


export default function Page() {
  const { user } = useUser()
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user.id);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => {
    loadData()
  }, [loadData]);

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteTransaction(id) }
      ]
    );
  }

  if (isLoading && !refreshing) return <PageLoad />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
            source={require("../../assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"/>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Weclome, </Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton/>
          </View>
        </View>

        <BalanceCard summary={summary}/>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>
        </View>

      </View>

      <FlatList
      style={styles.transactionsList}
      contentContainerStyle={styles.transactionsListContent}
      data={transactions}
      renderItem={({item}) => (
        <TransactionItem item={item} onDelete={handleDelete}/>
      )}
      ListEmptyComponent={<NoTransactionsFound />}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </View>
  )
}