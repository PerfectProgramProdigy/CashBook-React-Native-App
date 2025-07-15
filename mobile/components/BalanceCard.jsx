import {View, Text} from 'react-native'
import { styles } from '../assets/styles/home.styles';
import {COLORS} from '../constants/colors';

export const BalanceCard = ({summary}) => {
    return (
        <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Balance</Text>
            <Text style={styles.balanceAmount}>AED {parseFloat(summary.balance).toFixed(2)}</Text>
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Income</Text>
                    <Text style={[styles.balanceStatAmount, {color: COLORS.income}]}>
                        +AED {parseFloat(summary.income).toFixed(2)}</Text>
                </View>
                <View style={[styles.balanceStatItem, styles.statDivider]} />
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Expenses</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
                        -AED {Math.abs(parseFloat(summary.expense)).toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
}
