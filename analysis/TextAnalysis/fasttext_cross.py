# lightGBM
# 必要なライブラリのimport
import csv
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics import accuracy_score, log_loss, recall_score, precision_score, f1_score
from matplotlib import pyplot as plt

import fasttext
import japanize_matplotlib
from sklearn.manifold import TSNE


def main():
    """
    データの整形
    """
    df = pd.read_csv('edited_df.csv')

    X = df['disclosure']
    y = df["choice"]

    X_train = X
    y_train = y
    # K fold.
    folds = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
    folds_idx = [(train_idx, val_idx) 
                 for train_idx, val_idx in folds.split(X_train, y=y_train)]
    
    vectors = np.zeros((447, 300))
    score = []
    for n_fold, (train_idx, valid_idx) in enumerate(folds_idx):
        train_x, train_y = X.iloc[train_idx], y.iloc[train_idx]
        valid_x, valid_y = X.iloc[valid_idx], y.iloc[valid_idx]

        with open('fasttext_train.txt', 'w') as temp_file:
            for text in train_x:
                temp_file.write(f"{text}\n")

        with open('fasttext_test.txt', 'w') as temp_file:
            for text in valid_x:
                temp_file.write(f"{text}\n")

        model = fasttext.train_supervised(input='./fasttext_train.txt', lr=0.5, epoch=500, minn=3, maxn=5, wordNgrams=3, loss='ova', dim=300, bucket=200000)

        ret = model.test('./fasttext_test.txt')

        print("ret: ", ret)

        for index, split_word in enumerate(df['disclosure']):
            vectors[index] += model.get_sentence_vector(split_word)
    vectors /= 10
    # with open('./fasttext_test.txt') as f:
    #     for split_word in f:
    #         vectors.append(model.get_sentence_vector(split_word.strip('\n')))

    print(vectors.shape)
    #t-SNEで次元削減
    tsne = TSNE(n_components=2, random_state = 0, perplexity = 30, n_iter = 1000)
    vectors_embedded = tsne.fit_transform(np.array(vectors))

    ddf = pd.concat([df, pd.DataFrame(vectors_embedded, columns = ['col1', 'col2'])], axis = 1)

    label_dict = {
        'avoidance': 0,
        'none': 1,
        'passive': 2,
        'interactive': 3
        }
    label_list = list(label_dict.keys())

    label_jp = {"avoidance":"深呼吸を促す", "none":"何もしない", "passive":"受動的に弾き飛ばす", "interactive":"自主的に弾き飛ばす"}
    colors =  ["r", "g", "b", "y", "m", "y", "k", "orange","pink"]
    markers=['o', ',', 'v', '^'];
    plt.figure(figsize = (30, 30))
    for i , v in enumerate(label_list):
        tmp_df = ddf[ddf["category"] == i]
        plt.scatter(tmp_df['col1'],
                    tmp_df['col2'],
                    label = label_jp[v],
                    marker=markers[i], 
                    s=400, 
                    color = colors[i])

    plt.legend(fontsize = 30)
    plt.savefig('classification_fasttext.png')


if(__name__ =='__main__'):
    main();