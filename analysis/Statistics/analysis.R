# install.packages("jsonlite")
# require(fontregisterer)
# par(family= "HiraKakuProN-W3")
# theme_set(theme_gray(base_size=12, base_family="HiraKakuProN-W3"))
# CSVファイルの読み込み
raw_data <- read.csv("")
raw_data <- as.data.frame(t(raw_data))
# print(rownames(raw_data))

fb_jp <- list(
  avoidance = "深呼吸を促す",
  none = "何もしない",
  passive = "受動的に弾き飛ばす",
  interactive = "自主的に弾き飛ばす"
)
variable_jp <- list(
  E="外交性",A="協調性",C="勤勉性",N="神経質傾向",O="開放性",
  intensity="ストレスの大きさ",difficulty="ストレスの解決の難しさ",self_blame="自責の度合い",
  anger="怒り",sadness="悲しみ",fear="恐怖",shame="恥ずかしさ",tiredness="疲労感"
)
data <- list(
  avoidance = list(
    # disclosure = numeric(),
    effectiveness = numeric(),
    # reason = numeric(),
    E = numeric(),
    A = numeric(),
    C = numeric(),
    N = numeric(),
    O = numeric(),
    intensity = numeric(),
    difficulty = numeric(),
    self_blame = numeric(),
    anger = numeric(),
    sadness = numeric(),
    fear = numeric(),
    shame = numeric(),
    tiredness = numeric()
  ),
  interactive = list(
    # disclosure = numeric(),
    effectiveness = numeric(),
    # reason = numeric(),
    E = numeric(),
    A = numeric(),
    C = numeric(),
    N = numeric(),
    O = numeric(),
    intensity = numeric(),
    difficulty = numeric(),
    self_blame = numeric(),
    anger = numeric(),
    sadness = numeric(),
    fear = numeric(),
    shame = numeric(),
    tiredness = numeric()
  ),
  none = list(
    # disclosure = numeric(),
    effectiveness = numeric(),
    # reason = numeric(),
    E = numeric(),
    A = numeric(),
    C = numeric(),
    N = numeric(),
    O = numeric(),
    intensity = numeric(),
    difficulty = numeric(),
    self_blame = numeric(),
    anger = numeric(),
    sadness = numeric(),
    fear = numeric(),
    shame = numeric(),
    tiredness = numeric()
  ),
  passive = list(
    # disclosure = numeric(),
    effectiveness = numeric(),
    # reason = numeric(),
    E = numeric(),
    A = numeric(),
    C = numeric(),
    N = numeric(),
    O = numeric(),
    intensity = numeric(),
    difficulty = numeric(),
    self_blame = numeric(),
    anger = numeric(),
    sadness = numeric(),
    fear = numeric(),
    shame = numeric(),
    tiredness = numeric()
  )
)

print(length(raw_data))
for (idx in seq_along(raw_data)) {
    row <- raw_data[[idx]]
    choice <- row[3]
    
    # 1: timestamp
    # 2: disclosure
    # 3: choice
    data[[choice]]$effectiveness <- c(data[[choice]]$effectiveness, as.numeric(row[4]))
    # 5: choice reason
    data[[choice]]$intensity <- c(data[[choice]]$intensity, as.numeric(row[6]))
    data[[choice]]$difficulty <- c(data[[choice]]$difficulty, as.numeric(row[7]))
    # self_blame: 0->others, 6->self.
    data[[choice]]$self_blame <- c(data[[choice]]$self_blame, as.numeric(row[8]))
    data[[choice]]$anger <- c(data[[choice]]$anger, as.numeric(row[9]))
    data[[choice]]$sadness <- c(data[[choice]]$sadness, as.numeric(row[10]))
    data[[choice]]$fear <- c(data[[choice]]$fear, as.numeric(row[11]))
    data[[choice]]$shame <- c(data[[choice]]$shame, as.numeric(row[12]))
    data[[choice]]$tiredness <- c(data[[choice]]$tiredness, as.numeric(row[13]))
    data[[choice]]$E <- c(data[[choice]]$E, as.numeric(row[14]))
    data[[choice]]$A <- c(data[[choice]]$A, as.numeric(row[15]))
    data[[choice]]$C <- c(data[[choice]]$C, as.numeric(row[16]))
    data[[choice]]$N <- c(data[[choice]]$N, as.numeric(row[17]))
    data[[choice]]$O <- c(data[[choice]]$O, as.numeric(row[18]))
}

dependence_list <- c("E", "A", "C", "N", "O", "intensity", "difficulty", "self_blame", "anger", "sadness", "fear", "shame", "tiredness")
fb_list <- c('avoidance', 'none', 'passive', 'interactive')

# shapiro
for (dependence in dependence_list){
  print(dependence)
  for(fb in fb_list){
    print(fb)
    # print(length(data[[fb]][[dependence]]))
    result <- shapiro.test(data[[fb]][[dependence]])
    print(result)
  }
}

# kruskal
for ( dependence in dependence_list ) {
    print(dependence)
    result <- kruskal.test(x=list(
        data$avoidance[[dependence]],
        data$interactive[[dependence]],
        data$none[[dependence]],
        data$passive[[dependence]]))
    print(result)
}

# # カイ二乗検定
# for (dependence in dependence_list){
#   print(dependence)
#   d = c()
#   print(fb_list)
#   for (fb in fb_list){
#     # 0~6 and 2~14
#     tmp = rep(0, times = 15)
#     l = data[[fb]][[dependence]]
#     for(e in l){
#       tmp[e+1] <- tmp[e+1]+1
#     }
#     d <- c(d, tmp)
#   }
#   mat = data.frame(matrix(d,nrow=4,byrow=T))
#   mat <- mat[colSums(mat)!=0]
#   mat <- as.data.frame(t(mat))
#   print(mat)
#   result <- chisq.test(mat)
#   print(result)
# }

# visualization: violin plot
# install.packages("ggplot2")
library(ggplot2)
library("stringr")

for (dependence in dependence_list){
    Group = c()
    Value = c()
    idx <- "    "
    for (fb in fb_list){
      # fb_label <- fb
      # if (fb_label == "interactive" || fb_label =="passive"){
      #   fb_label <- paste(fb_label, "\ndisappearance")
      # }
      fb_label <- fb_jp[[fb]]
      idx <- str_sub(idx, end=-2)
      Group <- c(Group, data[[fb]][[dependence]])
      Value <- c(Value, rep( paste(idx, fb_label, sep=""), times = length(data[[fb]][[dependence]])))
    }
    data_visualization <- data.frame(Group = c(), Value = c())

    # Box plotの作成
    plot <- ggplot( data_visualization, aes(x = Value, y = Group, fill = Group)) +
        # geom_violin(trim = FALSE, scale = "width") +
        # stat_boxplot(geom = "errorbar", width = 0.25) +
        geom_boxplot(width = 0.25, fill = "white", color = "black", outlier.shape = NA) +
        theme_minimal() + 
        theme(text = element_text(size = 15, family = "HiraKakuProN-W3")) + 
        stat_summary(fun.y=mean, geom="point", shape=18, size=5, color="black", fill="black") +
        # labs(title = paste("Box plot: ", as.character(dependence)), x = "Feedback Design", y = "Score")
        labs(x = "フィードバックの種類", y = variable_jp[[dependence]])


    # 有意差があるものに***付与する関数.
    add_asterisk <- function(plot, x1, x2, y, mark){
      # 表示エリア y+0.2 ~ y+0.8
      return (plot + 
        # 有意差のマークをつける
        geom_text(x = (x1+x2)/2.0, y = y+0.7, label = mark) +
        # 横線.
        geom_segment(x = x1, xend = x2, y = y+0.5, yend = y+0.5) +
        # 縦線.
        geom_segment(x = x1, xend = x1, y = y+0.5, yend = y+0.2) +
        geom_segment(x = x2, xend = x2, y = y+0.5, yend = y+0.2)
      )
    }

    # 項目ごとに設定.
    # ylimは y+ 0.8
    # yにはmaxの値を入れる
    if (dependence == "sadness"){
      plot <- add_asterisk(plot, 1, 2, 6.0, "*")
      plot <- plot + ylim(c(0, 6.8))
    }
    else if (dependence == "fear"){
      plot <- add_asterisk(plot, 1, 4, 7.0, "**")
      plot <- add_asterisk(plot, 1, 3, 6.5, "*")
      plot <- add_asterisk(plot, 1, 2, 6.0, "*")
      plot <- plot + ylim(c(0, 7.8))
    }
    else if (dependence == "intensity"){
      plot <- add_asterisk(plot, 1, 1.95, 6.0, "**")
      plot <- add_asterisk(plot, 2.05, 4, 6.0, "*")
      plot <- plot + ylim(c(0, 6.8))
    }
    else if (dependence == "self_blame"){
      plot <- add_asterisk(plot, 2, 3, 6.0, "*")
      plot <- add_asterisk(plot, 1, 3, 6.5, "*")
      plot <- plot + ylim(c(0, 7.3))
    }
    else if (dependence == "anger"){
      plot <- add_asterisk(plot, 2, 4, 7.0, "***")
      plot <- add_asterisk(plot, 1, 4, 6.5, "***")
      plot <- add_asterisk(plot, 1, 1.95, 6.0, "**")
      plot <- add_asterisk(plot, 2.05, 2.95, 6.0, "***")
      plot <- add_asterisk(plot, 3.05, 4, 6.0, "**")
      plot <- plot + ylim(c(0, 7.8))
    }

    # print(plot)
    ggsave(paste("../Dicomo/Box_plot_", as.character(dependence), ".jpg", sep=""), plot, width = 8, height = 6, units = "in", dpi = 300)
}


THIS_FUNCTION_CALLS_ERROR()

# steel dwass.
# install.packages("NSM3")
library("NSM3")

dependence_list <- c("intensity", "self_blame", "anger", "sadness", "fear")
for (dependence in dependence_list) {
    print(dependence)
    values <- c()
    groups <- c()
    # fb_list <- c('avoidance', 'none', 'passive', 'interactive')
    d <- data$avoidance[[dependence]]
    values <- c(values, d)
    groups <- c(groups, rep(1, times = length(d)))

    d <- data$none[[dependence]]
    values <- c(values, d)
    groups <- c(groups, rep(2, times = length(d)))

    d <- data$passive[[dependence]]
    values <- c(values, d)
    groups <- c(groups, rep(3, times = length(d)))

    d <- data$interactive[[dependence]]
    values <- c(values, d)
    groups <- c(groups, rep(4, times = length(d)))

    # デフォルトではMonte Carloが使用される。
    # 試行数が10,000未満の場合はExactと同じとなる。
    # 正確法: method="Exact"
    # 近似法: method="Asymptotic"
    # 再現性確保のためにseedを設定する
    set.seed(0)
    p_monte = pSDCFlig(values, groups, method="Monte Carlo")
    print(p_monte$labels) # => "1 - 2" "1 - 3" "2 - 3"
    print(p_monte$p.val)  # => 0.0090 0.0163 0.3780
}

