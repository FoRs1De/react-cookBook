/* eslint-disable */
import './App.css';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Contentful from './Contentful';

import Layout from './components/Layout';
import NotFound from './components/NotFound';
import Home from './components/Home';
import Recipe from './components/Recipe';
import Form from './components/Form';

function App() {
  const [recipe, setRecipe] = useState([]);
  const { getCookbook } = Contentful();
  const [loading, setLoading] = useState(true);
  const [newRecipe, setNewRecipe] = useState({});

  useEffect(() => {
    getCookbook()
      .then((res) => {
        if (res) {
          setRecipe(res);
        }
        setLoading(false); // Set loading to false once the data is fetched
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Handle the error and set loading to false
      });
  }, []);

  // Create a function to group recipes by group name
  const groupRecipesByGroup = (recipes) => {
    const groupedRecipes = {};
    recipes.forEach((recipe) => {
      if (!groupedRecipes[recipe.group]) {
        groupedRecipes[recipe.group] = [];
      }
      groupedRecipes[recipe.group].push(recipe);
    });
    return groupedRecipes;
  };

  const groupedRecipes = groupRecipesByGroup(recipe);

  useEffect(() => {
    const createNewEntry = async (newEntryData) => {
      try {
        const accessToken = 'CFPAT--CMMMjYb7BYf6DFkqB_IUKBsP7am2McwVxodOt-E-Fk';
        const spaceId = 'fvwgdnm4oux1';
        const contentTypeId = 'cookbook';

        const url = `https://api.contentful.com/spaces/${spaceId}/environments/master/entries`;

        const response = await axios.post(
          url,
          {
            fields: newEntryData,
            contentTypeId: contentTypeId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        return response.data;
      } catch (error) {
        console.error('Error creating new entry:', error.message);
        return null;
      }
    };

    // Usage example
    const newEntryData = newRecipe;
    console.log(newRecipe);
    createNewEntry(newEntryData).then((createdEntry) => {
      if (createdEntry) {
        console.log('New entry created:', createdEntry);
      } else {
        console.log('Failed to create new entry.');
      }
    });
  }, [newRecipe]);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Layout recipes={groupedRecipes} loading={loading} />}
        >
          <Route index element={<Home recipe={recipe} loading={loading} />} />
          {recipe.map((groupRecipe) => (
            <Route
              key={groupRecipe.group}
              path={`/:group/:name/:recipeId`}
              element={<Recipe recipe={recipe} loading={loading} />}
            />
          ))}
          <Route
            path="add-item"
            element={
              <Form
                recipe={recipe}
                loading={loading}
                setNewRecipe={setNewRecipe}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
