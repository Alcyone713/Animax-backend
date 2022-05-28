from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MaxAbsScaler
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sys

anime = pd.read_csv("./Python/animes.csv")
# anime = pd.read_csv("./animes.csv")
# print(anime.head())
anime.loc[(anime["genre"] == "Hentai") & (
    anime["episodes"] == ""), "episodes"] = "1"
anime["episodes"] = anime["episodes"].map(lambda x: np.nan if x == "" else x)
anime["episodes"].fillna(anime["episodes"].median(), inplace=True)
anime["score"] = anime["score"].astype(float)
anime["score"].fillna(anime["score"].median(), inplace=True)
anime["members"] = anime["members"].astype(float)

anime_features = pd.concat([anime["genre"].str.get_dummies(
    sep=","), anime[["score"]], anime[["members"]], anime["popularity"]], axis=1)


max_abs_scaler = MaxAbsScaler()
anime_features = max_abs_scaler.fit_transform(anime_features)
nbrs = NearestNeighbors(
    n_neighbors=6, algorithm='ball_tree').fit(anime_features)
distances, indices = nbrs.kneighbors(anime_features)


def get_index(id):
    return anime[anime["uid"] == id].index.tolist()[0]

# def get_index_from_name(title):
#     return anime[anime["title"]==title].index.tolist()[0]

# print(get_index_from_name("Naruto"))
# print(distances[144])
# print(indices[144])


# queryArr = ["Naruto", "One Piece",
#             "Boku no Hero Academia", "Death Note", "lksdjfskl"]

# queryArr = [5114, 1535, 31964, 22319, 16498, 20507]
queryArr= sys.argv[1]
# print(queryArr)
queryArr = queryArr.replace("[", "")
queryArr = queryArr.replace("]", "")
queryArr = queryArr.replace(" ", "")
queryArr=queryArr.split(",")


for i in range(0, len(queryArr)):
    queryArr[i] = int(queryArr[i])


def get_similar_animes(query):
    recArr = np.array([])
    try:
        found_id = get_index(query)
    except IndexError:
        found_id = 5114

    for uid in indices[found_id][2:]:
        recArr = np.append(recArr, anime.loc[uid]["uid"])
    return recArr


recommendations = np.array([])
for i in queryArr:
    recommendations = np.append(recommendations, get_similar_animes(i))

result = recommendations.flatten()
result = np.unique(result)
results = result.tolist()
print(results)
