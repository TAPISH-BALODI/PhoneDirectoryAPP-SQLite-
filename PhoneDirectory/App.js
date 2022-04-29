/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState,useEffect}from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Flatlist
} from 'react-native';

import {openDatabase} from 'react-native-sqlite-storage' ;
const db=openDatabase({
  name:"rn_sqlite",
})
 


const App = () => {
  
  
  const [contactlist,setcontactlist]=useState([]);
  const [searchName,setSearch] =useState('');
  const [contactName,setContactName] =useState('');
  const [contactNum,setContactNum] =useState('');

  const createTables=()=>{
    db.transaction(txn=>{
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT , name VARCHAR(20) , num INTEGER(13) )',
        [],
        (SQLtXN:SQLTransaction,res:SQLResultSet)=>{
          console.log("table create success");

        },
        error=>{
          console.log("error on creation table"+error.message);
        }
      )
    })
  }


  const display=
    <View style={styles.displayContacts}>
  <ScrollView>

         {contactlist.map((item, key)=>(
           <View style={styles.listOfContacts}>
        <Text key={item.id} style={styles.name} > { item.name } </Text>
        <Text key={item.id} style={styles.number} > { item.num} </Text>
        </View>
        ))
        }

    </ScrollView>
    </View>
  
        
  const addContact=()=>{
    if(!contactName && !contactNum){
      alert("Enter Name and Number");
      return false;
    }
    db.transaction(txn=>{
      txn.executeSql(
        'INSERT INTO contacts (name,num) VALUES (?,?)',
        [contactName,contactNum],
        (sql:SQLTransaction,res:SQLResultSet)=>{
          console.log(`${contactName} and ${contactNum}  added successfully`);
          getContacts();
          setcontactlist("");
        },
        error=>{
          console.log("error on adding "+error.message);
        }
      );
    });
    console.log("adding wait");

  }
  const getContacts=()=>{
    db.transaction(txn=>{
      txn.executeSql(
        'SELECT * FROM contacts ORDER BY name ASC',
        [],
        (sqlTxn:SQLTransaction,res:ResultSet)=>{
              console.log("contacts fetched successfully");
              let len=res.rows.length;


              if(len>0){
                let results=[];
                for(let i=0;i<len;i++)
                {
                  let item=res.rows.item(i);
                  results.push({id: item.id, name: item.name ,num: item.num });
                  console.log("pushed");
                }
                console.log(results);
                setcontactlist(results);
              }
        },
        error=>{
          console.log("error while fetching"+error.message);
        }
      )
    })
  }
  const drop=()=>{
    db.transaction(txn=>{
      txn.executeSql(
        'DROP TABLE contacts;'
      )
     console.log("dropped");
    })
  }

  useEffect(()=>{
   
    getContacts();
  
    
    
  },[]);


  return (
    <SafeAreaView >
     <View style={styles.container}>
  
    <View style={styles.headerview}>
     <Text style={styles.header}>PHONE DIRECTORY</Text>
   </View>

      {/* searching for a contact */}


      <View style={styles.SearchBar}>
          <TextInput  value={searchName} onChangeText={text=>setSearch(text)} placeholder='Enter Contact Name' style={styles.TextInput}></TextInput>

            <TouchableOpacity 
            onPress={()=>console.log("search")}
            style={styles.footerviewsearch}>
              <View>
                  
              <Text style={styles.searchcontact}>SEARCH</Text>
              </View>

            </TouchableOpacity >

       </View>
  
      
        {/*displaying  contacts  */}
        
      
          {display}
        
        
      
       {/* adding contacts */}

      <View style={styles.BottomNavbar}>

          <TextInput  value={contactName} onChangeText={text=>setContactName(text)} placeholder='Enter Contact Name' style={styles.TextInputAddName}></TextInput>
          <TextInput keyboardType='number-pad'  value={contactNum} onChangeText={text=>setContactNum(text)} placeholder='Enter Contact Number' style={styles.TextInputAddNum}></TextInput>
        <TouchableOpacity style={styles.footerViewContact} onPress={()=>addContact()}>
          
          <Text style={styles.addTextButton} >ADD</Text>
          

        </TouchableOpacity >

      
      </View>

</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{

    backgroundColor:'pink',
    height:720,
  },
  headerview:{
    backgroundColor:'yellow'
  },
  header:{
    fontSize:30,
    textAlign:'center'
  },
  SearchBar:{
    backgroundColor:'white',
    flexDirection:'row',
    justifyContent:'space-around',
    borderRadius:10,
    borderWidth:1,
    marginTop:10,
    
  },
  TextInput:{
    backgroundColor:'yellow',
    width:200,
    borderRadius:15

  },
  footerviewsearch:{
    backgroundColor:'yellow',
    width:100,
    borderRadius:15
  },
  searchcontact:{
    textAlign:'center',
    fontSize:20,
    marginTop:7,

  },
  BottomNavbar:{
    top:5,
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent:'space-around',
    borderRadius:10,
    borderWidth:1,
    marginTop:10
  },
  TextInputAddName:{
    backgroundColor:'yellow',
    width:380,
    borderRadius:15
  },
  TextInputAddNum:{
    backgroundColor:'yellow',
    width:380,
    borderRadius:15
  },
  footerViewContact:{
    alignItems:'center',
    fontSize:20,
    marginTop:2,
  },
  addTextButton:{
    marginTop:5,
    marginLeft:10,
    marginBottom:5,
    fontSize:20,
    textAlign:'center',
    backgroundColor:'green',
    width:100,
    height:35,
    borderRadius:10,
  }
  ,
  displayContacts:{
    marginTop:5,
    borderWidth:1,
    backgroundColor:'white',
    height:420
  },
  listOfContacts:{
    flexDirection:'row',
    justifyContent:'space-around'
  },
  name:{
    fontSize:20,
    color:'black',
    borderWidth:1,
    width:180
  },
  number:{
    fontSize:20,
    color:'black',
    borderWidth:1,
    width:180
  }

});

export default App;
