import pandas as pd
import numpy as np
import japanize_matplotlib
import matplotlib.pyplot as plt
# import statsmodels.api as sm
# from patsy import dmatrices
# import scipy.stats as st

def main():
    fb_jp = {
        "avoidance":"深呼吸を促す",
        "none":"何もしない",
        "passive":"受動的に弾き飛ばす",
        "interactive":"自主的に弾き飛ばす"
    }
    variable_jp = {
        "E": "外交性","A": "協調性","C": "勤勉性","N": "神経質傾向","O": "開放性",
        "intensity": "ストレスの大きさ","difficulty": "ストレスの解決の難しさ","self_blame": "自責の度合い",
        "anger": "怒り","sadness": "悲しみ","fear": "恐怖","shame": "恥ずかしさ","tiredness": "疲労感"
    }

    """
    データ読み込み
    """
    df_list = []
    # この順に0, 1, 2, 3.
    fb_list = ["avoidance", "interactive", "none", "passive"]
    # LGBMClassifierではeffectiveness使ってない.
    dependence_list = ["E", "A", "C", "N", "O", "intensity", "difficulty", "self_blame", "anger", "fear", "sadness","shame", "tiredness"]
    for fb in fb_list:
        df = pd.read_csv('../Dicomo/'+str(fb)+'.csv', header= None)
        df.columns = dependence_list
        df_list.append(df)
    df_data = pd.read_csv('../Dicomo/data_lightgbm.csv', header= None)
    df_data.columns = dependence_list

    """
    accuracyのスコア表示
    """
    # df_result_mean = df_result.mean()
    # df_result_stdev = df_result.std()
    # print(df_result_mean)
    # print(df_result_stdev)

    """
    重要な変数を抽出するために、mean(abs(shap))を計算してプロット
    """
    mean_abs = {}
    for dependence in dependence_list:
        mean_abs[dependence] = []
        for i in range(4):
            # print(fb_list[i])
            abs_sum = 0
            for value in df_list[i][dependence]:
                # print(value)
                abs_sum += np.abs(value)
            mean_abs[dependence].append(abs_sum/len(df_list[i]))
            # print(f'{dependence}: {abs_sum/len(df_list[i])}')
    dependence_list_sorted = sorted(dependence_list, key = lambda x: np.sum(mean_abs[x]), reverse=True)

    # グラフ出力.
    fig = plt.figure(figsize=(16,10))
    plt.rcParams['font.size'] = 12
    ax = fig.add_subplot(111)
    # fbごとに積み上げ.
    bottom_sum = [0 for i in range(len(dependence_list_sorted))]
    color = ["#F87171", "#22C55E", "#0EA5E9", "#6366F1"]
    dependence_list_sorted_jp = [variable_jp[d] for d in dependence_list_sorted]
    for i in range(4):
        data = []
        for idx, dependence in enumerate(dependence_list_sorted):
            data.append(mean_abs[dependence][i])
        # グループ名(列)、i行目、~i行目までの和をケツに.
        ax.bar(dependence_list_sorted_jp, data, bottom = bottom_sum, color = color[i])
        for idx, dependence in enumerate(dependence_list_sorted):
            bottom_sum[idx]+= mean_abs[dependence][i]
    ax.tick_params(axis="x", rotation=20)
    ax.set_xlabel('入力変数', fontsize = 15)
    ax.set_ylabel('Shapley value の絶対平均値', fontsize = 15)
    ax.legend(["深呼吸を促す", "自主的に弾き飛ばす", "何もしない", "受動的に弾き飛ばす"], fontsize=15)
    # plt.show()
    plt.savefig("../Dicomo/shap_general.jpg")

    """
    上位の変数からプロットをしよう
    """
    # marker = ['o', 's', 'v', '^']
    marker = [',', ',', ',', ',']
    for dependence in dependence_list_sorted:
        plt.figure(figsize=(10,7))
        for i in range(4):
            fb_label = fb_list[i]
            # if(fb_label == 'interactive' or fb_label=='passive'):
            #     fb_label += " disappearance"
            data = {}
            for idx in range(len(df_list[i])):
                shap_value = df_list[i][dependence].iloc[idx]
                data_value = df_data[dependence].iloc[idx]
                if data_value not in data:
                    data[data_value] = [shap_value]
                else:
                    data[data_value].append(shap_value)
            plot_x = []
            plot_y = []
            plot_err = []
            keys_list = list(data.keys())
            for key in sorted(keys_list):
                # fb, dependence = key: の時のshap 配列.
                value = data[key]
                average = np.average(value)
                stdev = np.std(value)
                sterr = stdev / np.sqrt(len(value))
                plot_x.append(key)
                plot_y.append(average)
                # 標準偏差
                # plot_err.append(stdev)
                # 標準誤差
                # ランダムサンプリングを繰り返しているから標準誤差を使うと必要以上に小さくなりそう.
                plot_err.append(sterr)

            # y軸方向にのみerrorbarを表示
            plt.errorbar(plot_x, plot_y, yerr = plot_err, capsize=5, fmt=marker[i], markersize=5, 
                         ecolor=color[i], markeredgecolor = color[i], color=color[i], linestyle='-', 
                         label = fb_jp[fb_label])
            
            # """
            # statsmodelで回帰分析
            # """
            # """
            # # https://datatofish.com/statsmodels-linear-regression/
            # """ 
            # print(fb_list[i], dependence)
            # # df_list[i][dependence]: df column shap
            # # df_data[dependence]: df column data
            # joined_df = pd.concat([df_list[i][dependence], df_data[dependence]], axis=1, join='outer')
            # # joined_df = joined_df * 10;
            # joined_df.columns = ["shap", dependence]

            # y, x = dmatrices('shap ~ '+str(dependence), data=joined_df, return_type='dataframe')
            # model = sm.OLS(y, x).fit()
            # predictions = model.predict(x)
            # print(model.f_pvalue, model.rsquared)
            # if(model.f_pvalue >= 0.05):
            #     print("out")
            # else:
            #     plt.plot(df_data[dependence], predictions, color=color[i], linestyle=':')

        plt.xlabel(str(variable_jp[dependence])+"の値", fontsize=18)
        plt.ylabel(str(variable_jp[dependence])+"\nに対するShapley value の平均値", fontsize=18)
        # plt.ylim(-0.8, 0.8)
        plt.legend(fontsize=15)
        # plt.show()
        plt.savefig("../Dicomo/shap_"+dependence+".jpg")

    return 0;

if __name__ == '__main__':
    main()