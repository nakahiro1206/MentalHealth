# lightGBM
# 必要なライブラリのimport
import csv
import pandas as pd
import numpy as np
import lightgbm as lgb

from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics import accuracy_score, log_loss, recall_score, precision_score, f1_score
from matplotlib import pyplot as plt

import shap


def main():
    """
    データの整形
    """
    df = pd.read_csv('../Dicomo/data.csv')
    # print(df)

    print("data was loaded.")

    # includes effectiveness
    dependence_list = ["E", "A", "C", "N", "O", "intensity", "difficulty", "self_blame", "anger", "fear", "sadness","shame", "tiredness"]

    X = df[dependence_list]
    y = df["choice"]
    # print(type(y))
    # return;
    # fb_list <- c('avoidance', 'interactive', 'none', 'passive')
    y= y.replace('avoidance', 0)
    y = y.replace('interactive', 1)
    y = y.replace('none', 2)
    y = y.replace('passive', 3)
    # print(y)

    """
    seedを色々試す
    """
    # class_names = ["avoidance", "interactive", "none", "passive"]
    file = []
    writer = []
    for fb in ["avoidance", "interactive", "none", "passive"]:
        f = open("../Dicomo/"+str(fb)+".csv", "w")
        w = csv.writer(f)
        file.append(f)
        writer.append(w)
    f_data = open("../Dicomo/data_lightgbm.csv", "w")
    w_data = csv.writer(f_data)

    # そのままtrain
    X_train = X
    y_train = y
    # K fold.
    folds = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
    folds_idx = [(train_idx, val_idx) 
                 for train_idx, val_idx in folds.split(X_train, y=y_train)]
    
    shap_values = None
    score = []
    for n_fold, (train_idx, valid_idx) in enumerate(folds_idx):
        train_x, train_y = X.iloc[train_idx], y.iloc[train_idx]
        valid_x, valid_y = X.iloc[valid_idx], y.iloc[valid_idx]    
        clf = lgb.LGBMClassifier(class_weight="balanced", verbose=-1, early_stopping_rounds=100)
        clf.fit(train_x, train_y, 
                eval_set=[(train_x, train_y), (valid_x, valid_y)])
        explainer = shap.TreeExplainer(clf)
        if shap_values is None:
            shap_values = explainer.shap_values(X)
        else:
            shap_values += explainer.shap_values(X)       
        y_pred = clf.predict(X)
        if score is None:
            score = [accuracy_score(y, y_pred), 
                        recall_score(y, y_pred, average='macro'), 
                        precision_score(y, y_pred, average='macro'), 
                        f1_score(y, y_pred, average='macro')]
        else:
            New = [accuracy_score(y, y_pred), 
                        recall_score(y, y_pred, average='macro'), 
                        precision_score(y, y_pred, average='macro'), 
                        f1_score(y, y_pred, average='macro')]
            score.append(New)
    for i,fb in enumerate(shap_values):
        for j,r in enumerate(fb):
            for k,e in enumerate(r):
                shap_values[i][j][k] /=10.0 # number of folds
    print(shap_values.shape)
    print(score)
    score_nd = np.array(score)
    score_t = score_nd.transpose()
    print(score_t)
    for r in score_t:
        print(np.mean(r))
        print(np.std(r))
    
    # data record
    w_data.writerows(X.to_numpy().tolist())
    for i in range(4):
        d = []
        for row in shap_values:
            r = [e[i] for e in row]
            d.append(r)
        writer[i].writerows(d)
        
    for i in range(4):
        file[i].close()
    f_data.close()

if(__name__ =='__main__'):
    main();