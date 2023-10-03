import { View, Text, ScrollView, Appearance } from 'react-native'
import React, { useState } from 'react'
import CategoryCard from './CategoryCard';
import {NewspaperIcon} from "react-native-heroicons/outline";

const Categories = ({selectedTheme, setSelectedTheme}) => {
  const theme = Appearance.getColorScheme();  
  const isDarkTheme = theme === 'dark';

  const handleThemeClick = (theme) => {
    if (selectedTheme === theme) {
      // If the clicked theme is already selected, deselect it
      setSelectedTheme(null);
    } else {
      setSelectedTheme(theme);
    }
  };

  return (
    <ScrollView 
      className={`${isDarkTheme ? 'bg-black' : 'bg-white'}`}
      contentContainerStyle={{
        paddingHorizontal:15,
        padding:10
      }}
      showsHorizontalScrollIndicator={false}
      horizontal>
      {/* Category Card */}
      <CategoryCard imgUrl="https://i.imgur.com/MR04pXN.png" onPress={() => handleThemeClick("journal")} theme='Journals' selected={selectedTheme === "journal"}/>
      <CategoryCard imgUrl="https://i.imgur.com/2x9hSHb.png" onPress={() => handleThemeClick("journalism")} theme='Journalism' selected={selectedTheme === "journalism"}/>
      <CategoryCard imgUrl="https://i.imgur.com/9LMadDP.png" onPress={() => handleThemeClick("romance")} theme='Romance' selected={selectedTheme === "romance"}/>
      <CategoryCard imgUrl="https://i.imgur.com/PTy8djy.png" onPress={() => handleThemeClick("thriller")} theme='Thriller' selected={selectedTheme === "thriller"}/>
      <CategoryCard imgUrl="https://i.imgur.com/k5XrhOk.png" onPress={() => handleThemeClick("mystery")} theme='Mystery' selected={selectedTheme === "mystery"}/>
      <CategoryCard imgUrl="https://i.imgur.com/6Z2q0Qv.png" onPress={() => handleThemeClick("period")} theme='Period' selected={selectedTheme === "period"}/>
      <CategoryCard imgUrl="https://i.imgur.com/yUU8vjo.png" onPress={() => handleThemeClick("fantasy")} theme='Fantasy' selected={selectedTheme === "fantasy"}/>
      <CategoryCard imgUrl="https://i.imgur.com/onfZPLI.png" onPress={() => handleThemeClick("dystopian")} theme='Dystopian' selected={selectedTheme === "dystopian"}/>
      <CategoryCard imgUrl="https://i.imgur.com/fFGNFq1.png" onPress={() => handleThemeClick("supernatural")} theme='Supernatural' selected={selectedTheme === "supernatural"}/>
      <CategoryCard imgUrl="https://i.imgur.com/IkGYKMT.png" onPress={() => handleThemeClick("horror")} theme='Horror' selected={selectedTheme === "horror"}/>
      <CategoryCard imgUrl="https://i.imgur.com/DmHMWn2.png" onPress={() => handleThemeClick("psychology")} theme='Psychology' selected={selectedTheme === "psychology"}/>


    </ScrollView>
  )
}

export default Categories