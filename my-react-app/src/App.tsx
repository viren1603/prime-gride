import React, { useState } from "react";
import CustomGrid from "./components/PrimeGrid/CustomGrid";

function App() {

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);


  const dataSource = [
    { id: 1, name: "John", email: "john@example.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdabc123", time: "10:30 AM", country: "USA", city: "New York", phone: "9876543210", status: "active", role: "admin", age: "34", gender: "male", zipCode: "10001", address: "123 Main St", company: "TechCorp", department: "IT", salary: "80000", experience: "10 years", language: "English", skills: "React, Node.js", education: "Bachelor's Degree", hobby: "Gaming", favoriteColor: "Blue", food: "Pizza" , diamondList : [{ id: 1, name: "John", email: "john@example.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdabc123", time: "10:30 AM", country: "USA", city: "New York", phone: "9876543210", status: "active", role: "admin", age: "34", gender: "male", zipCode: "10001", address: "123 Main St", company: "TechCorp", department: "IT", salary: "80000", experience: "10 years", language: "English", skills: "React, Node.js", education: "Bachelor's Degree", hobby: "Gaming", favoriteColor: "Blue", food: "Pizza" , description: "idkasjn" },
      { id: 2, name: "Alice", email: "alice@mail.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdxyz789", time: "3:45 PM", country: "Canada", city: "Toronto", phone: "9123456789", status: "inactive", role: "user", age: "28", gender: "female", zipCode: "M4B 1B3", address: "45 Queen St", company: "BizGroup", department: "HR", salary: "60000", experience: "5 years", language: "French", skills: "Python, Django", education: "Master's Degree", hobby: "Reading", favoriteColor: "Green", food: "Sushi" },] },
    { id: 2, name: "Alice", email: "alice@mail.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdxyz789", time: "3:45 PM", country: "Canada", city: "Toronto", phone: "9123456789", status: "inactive", role: "user", age: "28", gender: "female", zipCode: "M4B 1B3", address: "45 Queen St", company: "BizGroup", department: "HR", salary: "60000", experience: "5 years", language: "French", skills: "Python, Django", education: "Master's Degree", hobby: "Reading", favoriteColor: "Green", food: "Sushi" },
    { id: 3, name: "Mike", email: "mike@work.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdqwerty", time: "9:00 AM", country: "UK", city: "London", phone: "8112233445", status: "active", role: "manager", age: "40", gender: "male", zipCode: "E1 6AN", address: "789 Oxford St", company: "Finance Inc.", department: "Finance", salary: "95000", experience: "15 years", language: "English", skills: "Excel, SQL", education: "PhD", hobby: "Traveling", favoriteColor: "Red", food: "Pasta" },
    { id: 4, name: "Sophia", email: "sophia@xyz.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdmypwd", time: "1:15 PM", country: "Germany", city: "Berlin", phone: "7788996655", status: "active", role: "admin", age: "29", gender: "female", zipCode: "10115", address: "88 Berlin St", company: "SoftTech", department: "Development", salary: "75000", experience: "7 years", language: "German", skills: "Java, Spring Boot", education: "Bachelor's Degree", hobby: "Cooking", favoriteColor: "Purple", food: "Tacos" },
    { id: 5, name: "David", email: "david@company.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdpassme", time: "8:00 PM", country: "France", city: "Paris", phone: "6677889900", status: "inactive", role: "user", age: "37", gender: "male", zipCode: "75001", address: "56 Champs Elysees", company: "DesignStudio", department: "Marketing", salary: "72000", experience: "8 years", language: "French", skills: "Photoshop, Illustrator", education: "Associate Degree", hobby: "Photography", favoriteColor: "Yellow", food: "Steak" },
    { id: 6, name: "Emma", email: "emma@fashion.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdsecure", time: "6:25 AM", country: "Italy", city: "Milan", phone: "6655443322", status: "active", role: "editor", age: "31", gender: "female", zipCode: "20121", address: "Via Roma 23", company: "FashionHouse", department: "Editorial", salary: "65000", experience: "6 years", language: "Italian", skills: "Writing, SEO", education: "Master's Degree", hobby: "Blogging", favoriteColor: "Pink", food: "Pasta" },
    { id: 7, name: "James", email: "james@tech.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdpass456", time: "12:00 PM", country: "Spain", city: "Madrid", phone: "5566778899", status: "active", role: "developer", age: "26", gender: "male", zipCode: "28001", address: "Plaza Mayor 10", company: "StartUp", department: "Engineering", salary: "70000", experience: "4 years", language: "Spanish", skills: "React, Angular", education: "Bachelor's Degree", hobby: "Cycling", favoriteColor: "Orange", food: "Burgers" },
    { id: 8, name: "Olivia", email: "olivia@biz.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdabc567", time: "7:30 AM", country: "Netherlands", city: "Amsterdam", phone: "4455667788", status: "inactive", role: "HR", age: "35", gender: "female", zipCode: "1012 AB", address: "Canal Street 9", company: "HR Solutions", department: "Human Resources", salary: "67000", experience: "9 years", language: "Dutch", skills: "Recruiting, HRMS", education: "MBA", hobby: "Yoga", favoriteColor: "Cyan", food: "Salad" },
    { id: 9, name: "Daniel", email: "daniel@ecom.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdloginme", time: "4:10 PM", country: "Australia", city: "Sydney", phone: "3344556677", status: "active", role: "manager", age: "41", gender: "male", zipCode: "2000", address: "Harbour Road 5", company: "EcomStore", department: "Sales", salary: "82000", experience: "12 years", language: "English", skills: "E-commerce, Analytics", education: "Bachelor's Degree", hobby: "Surfing", favoriteColor: "Teal", food: "BBQ" },
    { id: 10, name: "Ava", email: "ava@startup.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdava999", time: "11:55 PM", country: "Japan", city: "Tokyo", phone: "2233445566", status: "active", role: "CEO", age: "38", gender: "female", zipCode: "100-0001", address: "Ginza St 12", company: "InnovateTech", department: "Management", salary: "150000", experience: "15 years", language: "Japanese", skills: "Leadership, Strategy", education: "MBA", hobby: "Chess", favoriteColor: "Black", food: "Sushi" },
    { id: 1, name: "John", email: "john@example.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdabc123", time: "10:30 AM", country: "USA", city: "New York", phone: "9876543210", status: "active", role: "admin", age: "34", gender: "male", zipCode: "10001", address: "123 Main St", company: "TechCorp", department: "IT", salary: "80000", experience: "10 years", language: "English", skills: "React, Node.js", education: "Bachelor's Degree", hobby: "Gaming", favoriteColor: "Blue", food: "Pizza" },
    { id: 2, name: "Alice", email: "alice@mail.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdxyz789", time: "3:45 PM", country: "Canada", city: "Toronto", phone: "9123456789", status: "inactive", role: "user", age: "28", gender: "female", zipCode: "M4B 1B3", address: "45 Queen St", company: "BizGroup", department: "HR", salary: "60000", experience: "5 years", language: "French", skills: "Python, Django", education: "Master's Degree", hobby: "Reading", favoriteColor: "Green", food: "Sushi" },
    { id: 3, name: "Mike", email: "mike@work.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdqwerty", time: "9:00 AM", country: "UK", city: "London", phone: "8112233445", status: "active", role: "manager", age: "40", gender: "male", zipCode: "E1 6AN", address: "789 Oxford St", company: "Finance Inc.", department: "Finance", salary: "95000", experience: "15 years", language: "English", skills: "Excel, SQL", education: "PhD", hobby: "Traveling", favoriteColor: "Red", food: "Pasta" },
    { id: 4, name: "Sophia", email: "sophia@xyz.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdmypwd", time: "1:15 PM", country: "Germany", city: "Berlin", phone: "7788996655", status: "active", role: "admin", age: "29", gender: "female", zipCode: "10115", address: "88 Berlin St", company: "SoftTech", department: "Development", salary: "75000", experience: "7 years", language: "German", skills: "Java, Spring Boot", education: "Bachelor's Degree", hobby: "Cooking", favoriteColor: "Purple", food: "Tacos" },
    { id: 5, name: "David", email: "david@company.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdpassme", time: "8:00 PM", country: "France", city: "Paris", phone: "6677889900", status: "inactive", role: "user", age: "37", gender: "male", zipCode: "75001", address: "56 Champs Elysees", company: "DesignStudio", department: "Marketing", salary: "72000", experience: "8 years", language: "French", skills: "Photoshop, Illustrator", education: "Associate Degree", hobby: "Photography", favoriteColor: "Yellow", food: "Steak" },
    { id: 6, name: "Emma", email: "emma@fashion.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdsecure", time: "6:25 AM", country: "Italy", city: "Milan", phone: "6655443322", status: "active", role: "editor", age: "31", gender: "female", zipCode: "20121", address: "Via Roma 23", company: "FashionHouse", department: "Editorial", salary: "65000", experience: "6 years", language: "Italian", skills: "Writing, SEO", education: "Master's Degree", hobby: "Blogging", favoriteColor: "Pink", food: "Pasta" },
    { id: 7, name: "James", email: "james@tech.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdpass456", time: "12:00 PM", country: "Spain", city: "Madrid", phone: "5566778899", status: "active", role: "developer", age: "26", gender: "male", zipCode: "28001", address: "Plaza Mayor 10", company: "StartUp", department: "Engineering", salary: "70000", experience: "4 years", language: "Spanish", skills: "React, Angular", education: "Bachelor's Degree", hobby: "Cycling", favoriteColor: "Orange", food: "Burgers" },
    { id: 8, name: "Olivia", email: "olivia@biz.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdabc567", time: "7:30 AM", country: "Netherlands", city: "Amsterdam", phone: "4455667788", status: "inactive", role: "HR", age: "35", gender: "female", zipCode: "1012 AB", address: "Canal Street 9", company: "HR Solutions", department: "Human Resources", salary: "67000", experience: "9 years", language: "Dutch", skills: "Recruiting, HRMS", education: "MBA", hobby: "Yoga", favoriteColor: "Cyan", food: "Salad" },
    { id: 9, name: "Daniel", email: "daniel@ecom.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdloginme", time: "4:10 PM", country: "Australia", city: "Sydney", phone: "3344556677", status: "active", role: "manager", age: "41", gender: "male", zipCode: "2000", address: "Harbour Road 5", company: "EcomStore", department: "Sales", salary: "82000", experience: "12 years", language: "English", skills: "E-commerce, Analytics", education: "Bachelor's Degree", hobby: "Surfing", favoriteColor: "Teal", food: "BBQ" },
    { id: 10, name: "Ava", email: "ava@startup.com", passWord: "ssdf,msbfmjhvfhjasvfhjgasdvfhasgvfhajsgdava999", time: "11:55 PM", country: "Japan", city: "Tokyo", phone: "2233445566", status: "active", role: "CEO", age: "38", gender: "female", zipCode: "100-0001", address: "Ginza St 12", company: "InnovateTech", department: "Management", salary: "150000", experience: "15 years", language: "Japanese", skills: "Leadership, Strategy", education: "MBA", hobby: "Chess", favoriteColor: "Black", food: "Sushi" }
  ];
// 
// fixed: "left"
  const columns = [
    { title: "Name", dataIndex: "name", key: "name", width: 150, fixed: "left" },
    { title: "ID", dataIndex: "id", key: "id", width: 80, fixed: "left" },
    { title: "Email", dataIndex: "email", key: "email", width: 200 ,  },
    { title: "Password", dataIndex: "passWord", key: "passWord", width: 200 ,  },
    { title: "Time", dataIndex: "time", key: "time", width: 120 ,},
    { title: "Country", dataIndex: "country", key: "country", width: 150 ,  },
    { title: "City", dataIndex: "city", key: "city", width: 150  , },
    { title: "Phone", dataIndex: "phone", key: "phone", width: 150 },
    { title: "Status", dataIndex: "status", key: "status", width: 120 },
    { title: "Role", dataIndex: "role", key: "role", width: 120 },
    { title: "Age", dataIndex: "age", key: "age", width: 80 },
    { title: "Gender", dataIndex: "gender", key: "gender", width: 120 },
    { title: "Zip Code", dataIndex: "zipCode", key: "zipCode", width: 120 },
    { title: "Address", dataIndex: "address", key: "address", width: 200 },
    { title: "Company", dataIndex: "company", key: "company", width: 150 },
    { title: "Department", dataIndex: "department", key: "department", width: 150 },
    { title: "Salary", dataIndex: "salary", key: "salary", width: 120 },
    { title: "Experience", dataIndex: "experience", key: "experience", width: 150 },
    { title: "Language", dataIndex: "language", key: "language", width: 120 },
    { title: "Skills", dataIndex: "skills", key: "skills", width: 200 },
    { title: "Education", dataIndex: "education", key: "education", width: 200 },
    { title: "Hobby", dataIndex: "hobby", key: "hobby", width: 150 },
    { title: "Favorite Color", dataIndex: "favoriteColor", key: "favoriteColor", width: 150 },
    { title: "Food", dataIndex: "food", key: "food", width: 150 ,fixed: "right" }
  ];


  const handleExpand = (expanded: boolean, record: any) => {
    setExpandedKeys((prev) =>
      expanded ? [...prev, record.id] : prev.filter((key) => key !== record.id)
    );
  };

  return (
    <div>
      <CustomGrid
        data={dataSource}
        columns={columns}
        rowKey="id"
        expandedRowKeys={expandedKeys}
        onExpand={handleExpand}
        expandedRowRender={(record) => 
          <CustomGrid
          data={record?.diamondList}
          columns={columns}
          rowKey="id"
        />  
        }
      />
    </div>
  );
}

export default App;
