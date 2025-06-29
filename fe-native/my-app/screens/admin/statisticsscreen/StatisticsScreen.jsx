import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Dimensions, Alert, Platform
} from 'react-native';
import { API_URL } from '@env';
import { styles } from './StatisticsScreenCss';
import { BarChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import AdminFooter from '../../../components/AdminFooter';

export default function StatisticsScreen() {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateStr, setSelectedDateStr] = useState(moment(new Date()).format('YYYY-MM-DD'));

    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [revenueDate, setRevenueDate] = useState(null);
    const [revenueMonth, setRevenueMonth] = useState([]);
    const [revenueYear, setRevenueYear] = useState([]);

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const formatted = moment(selectedDate).format('YYYY-MM-DD');
            setSelectedDateStr(formatted);
        }
    };

    const fetchByDate = async () => {
        try {
            const res = await fetch(`${API_URL}/thongke/ngay/${selectedDateStr}`);
            const json = await res.json();
            if (json.success && json.data.length > 0) {
                setRevenueDate(json.data[0]);
            } else {
                setRevenueDate(null);
                Alert.alert('Không có thống kê cho ngày này');
            }
        } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
        }
    };

    const fetchByMonth = async () => {
        if (!month || !year) {
            return Alert.alert('Vui lòng chọn tháng và năm!');
        }
        try {
            const res = await fetch(`${API_URL}/thongke/thang/${year}/${month}`);
            const json = await res.json();
            if (json.success && json.data.length > 0) {
                setRevenueMonth(json.data);
            } else {
                setRevenueMonth([]);
                Alert.alert('Không có thống kê trong tháng');
            }
        } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
        }
    };

    const fetchByYear = async () => {
        if (!year) {
            return Alert.alert('Vui lòng chọn năm!');
        }
        try {
            const res = await fetch(`${API_URL}/thongke/nam/${year}`);
            const json = await res.json();
            if (json.success && json.data.length > 0) {
                setRevenueYear(json.data);
            } else {
                setRevenueYear([]);
                Alert.alert('Không có thống kê trong năm');
            }
        } catch {
            Alert.alert('Lỗi', 'Không thể kết nối server');
        }
    };

    const exportExcelByMonth = async () => {
        if (!month || !year) {
            return Alert.alert('Vui lòng chọn tháng và năm!');
        }

        try {
            const url = `${API_URL}/thongke/xuatexcel?type=thang&year=${year}&month=${month}`;
            const res = await fetch(url);

            if (!res.ok) throw new Error('Không thể tải file');

            const blob = await res.blob();
            const fileURL = URL.createObjectURL(blob);

            if (Platform.OS === 'web') {
                const a = document.createElement('a');
                a.href = fileURL;
                a.download = `bao_cao_thang_${month}_${year}.xlsx`;
                a.click();
            } else {
                Alert.alert(
                    'Tải file',
                    'Tính năng tải file chỉ hỗ trợ trên trình duyệt. Trên thiết bị di động cần xử lý riêng 💔📱'
                );
            }
        } catch (err) {
            console.error('Lỗi xuất báo cáo:', err);
            Alert.alert('Lỗi', 'Không thể xuất báo cáo!');
        }
    };


    const chartDataMonth = {
        labels: revenueMonth.map(item => {
            const d = new Date(item.ngay);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }),
        datasets: [
            {
                data: revenueMonth.map(item => parseFloat(item.doanh_thu)),
            }
        ]
    };

    const chartDataYear = {
        labels: revenueYear.map(item => `Tháng ${item.thang}`),
        datasets: [
            {
                data: revenueYear.map(item => parseFloat(item.doanh_thu)),
            }
        ]
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>📊 Thống kê doanh thu</Text>

                {/* === Ngày === */}
                <Text style={styles.label}>Chọn ngày:</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text>{selectedDateStr}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={onChangeDate}
                    />
                )}
                <TouchableOpacity style={styles.button} onPress={fetchByDate}>
                    <Text style={styles.buttonText}>📅 Xem thống kê ngày</Text>
                </TouchableOpacity>
                {revenueDate && (
                    <Text style={styles.result}>
                        💰 Doanh thu ngày {selectedDateStr}: {parseInt(revenueDate.doanh_thu).toLocaleString()} đ
                    </Text>
                )}

                {/* === Tháng === */}
                <Text style={styles.label}>Chọn tháng:</Text>
                <Picker selectedValue={month} onValueChange={setMonth} style={styles.input}>
                    <Picker.Item label="Chọn tháng" value="" />
                    {[...Array(12)].map((_, i) => (
                        <Picker.Item key={i + 1} label={`Tháng ${i + 1}`} value={i + 1} />
                    ))}
                </Picker>

                <Text style={styles.label}>Chọn năm:</Text>
                <Picker selectedValue={year} onValueChange={setYear} style={styles.input}>
                    <Picker.Item label="Chọn năm" value="" />
                    {[2023, 2024, 2025].map(y => (
                        <Picker.Item key={y} label={`${y}`} value={y} />
                    ))}
                </Picker>

                <TouchableOpacity style={styles.button} onPress={fetchByMonth}>
                    <Text style={styles.buttonText}>Xem biểu đồ tháng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#16a34a' }]}
                    onPress={exportExcelByMonth}
                >
                    <Text style={styles.buttonText}>Xuất báo cáo Excel</Text>
                </TouchableOpacity>

                {revenueMonth.length > 0 && (
                    <BarChart
                        data={chartDataMonth}
                        width={Dimensions.get('window').width - 40}
                        height={280}
                        fromZero
                        yAxisSuffix=" đ"
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
                            labelColor: () => '#000',
                            barPercentage: 0.7,
                        }}
                        style={{
                            borderRadius: 12,
                            marginVertical: 20,
                        }}
                    />
                )}

                {/* === Năm === */}
                <TouchableOpacity style={styles.button} onPress={fetchByYear}>
                    <Text style={styles.buttonText}>📈 Xem biểu đồ năm</Text>
                </TouchableOpacity>

                {revenueYear.length > 0 && (
                    <BarChart
                        data={chartDataYear}
                        width={Dimensions.get('window').width - 40}
                        height={280}
                        fromZero
                        yAxisSuffix=" đ"
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                            labelColor: () => '#000',
                            barPercentage: 0.6,
                        }}
                        style={{
                            borderRadius: 12,
                            marginVertical: 20,
                        }}
                    />
                )}
            </ScrollView>
            <AdminFooter />
        </View>
    );
}
