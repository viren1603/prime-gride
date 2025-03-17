import React, { useState } from 'react';
import CustomGrid from './components/PrimeGrid/CustomGrid';
// import ExtraSummaryBox from "./components/common/ExtraSummaryBox";
import { dataSource } from './components/data/ExportDatas';
import PrimeTd from './components/common/PrimeTd';

function App() {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
    },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80, fixed: 'left' },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
    { title: 'Password', dataIndex: 'passWord', key: 'passWord', width: 400 },

    { title: 'Time', dataIndex: 'time', key: 'time', width: 120 },
    { title: 'Country', dataIndex: 'country', key: 'country', width: 150 },
    { title: 'City', dataIndex: 'city', key: 'city', width: 150 },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120 },
    { title: 'Role', dataIndex: 'role', key: 'role', width: 120 },
    { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
    { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 120 },
    { title: 'Zip Code', dataIndex: 'zipCode', key: 'zipCode', width: 120 },
    { title: 'Address', dataIndex: 'address', key: 'address', width: 200 },
    { title: 'Company', dataIndex: 'company', key: 'company', width: 150 },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    { title: 'Salary', dataIndex: 'salary', key: 'salary', width: 120 },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      width: 150,
    },
    { title: 'Language', dataIndex: 'language', key: 'language', width: 120 },
    { title: 'Skills', dataIndex: 'skills', key: 'skills', width: 200 },
    {
      title: 'Education',
      dataIndex: 'education',
      key: 'education',
      width: 200,
    },
    { title: 'Hobby', dataIndex: 'hobby', key: 'hobby', width: 150 },
    {
      title: 'Favorite Color',
      dataIndex: 'favoriteColor',
      key: 'favoriteColor',
      width: 150,
    },
    {
      title: 'Food',
      dataIndex: 'food',
      key: 'food',
      width: 150,
      fixed: 'right',
    },
  ];

  const handleExpand = (expanded: boolean, record: any) => {
    setExpandedKeys((prev) => (expanded ? [...prev, record.id] : prev.filter((key) => key !== record.id)));
  };

  return (
    <div>
      <CustomGrid
        data={dataSource}
        columns={columns}
        rowKey="id"
        expandedRowKeys={expandedKeys}
        onExpand={handleExpand}
        isDraggable
        isResizable
        summary={{
          Name: { value: 'My Calculation' },
          ID: { value: 'viren' },
        }}
        expandedRow={true}
        expandedRowRender={(record) => <CustomGrid data={record?.diamondList} columns={columns} rowKey="id" />}
      />
    </div>
  );
}

export default App;
