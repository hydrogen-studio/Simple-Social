var Sentiment = require('sentiment');
var writeGood = require('write-good');
var swearjar = require('swearjar');

exports.sentiment = function(message) {
    var sentiment = new Sentiment();
    var result = sentiment.analyze(message);
    return result
}

exports.grammarHelper = function(message) {
    var suggestions = writeGood(message);
    return suggestions
}

exports.isNice = function(message) {
    let result = swearjar.profane(message)
    var sentiment = new Sentiment();
    var sentRes = sentiment.analyze(message);
    let calc = sentRes.calculation
    for(i in calc){
        let [first] = Object.keys(calc[i])
        let res = calc[i][first.toString()]

        if(res < -4){
            return {
                isNice: false,
                message: "This message will most likely offend someone, it is suggested that the wordings be changed"
            }
        }
    }

    if(sentRes.comparative < 0 && sentRes.comparative > -2){
        return {
            isNice: false,
            message: "This message scored lower than a 0 but higher than a -2 in sentiment analysis, meaning that this message could be offensive to some people."
        }
    }else if(sentRes.comparative < -2 && sentRes.comparative >= -4){
        return {
            isNice: false,
            message: "This message scored lower than a -2 but higher than a -4 in sentiment analysis, meaning that this message includes content that most people cosiders offensive."
        }
    }else if(sentRes.comparative < -4){
        return {
            isNice: false,
            message: "This message scored lower than a -4 in sentiment analysis, meaning that it is almost certain that recipient of the message will be offended."
        }
    }else if(sentRes.comparative > 0 && sentRes.comparative <= 2 && result == false){
        return {
            isNice: true,
            message: "This message scored more than 0 and less than 2 in sentiment analysis, and no swear word is found. This message will most likely not impress someone but at the same time not offend people."
        }   
    }else if(sentRes.comparative == 0 && result == false){
        return {
            isNice: true,
            message: "This message scored a 0 in sentiment analysis, and no swear word is found. This message will most likely not impress someone but at the same time not offend people."
        }   
    }else if(sentRes.comparative > 2 && sentRes.comparative <= 4 && result == false){
        return {
            isNice: true,
            message: "This message scored more than 2 and less than 4 in sentiment analysis, and no swear word is found. This message will likely make others feel happy."
        }   
    }else if(sentRes.comparative > 4 && result == false){
        return {
            isNice: true,
            message: "Although this message will not offend anyone, it may be possible that people feel weird of the excessive use of nice words."
        }   
    }else if(result == true){
        return {
            isNice: false,
            message: "This message contains swear words, meaning that an average, professional human being will not be too impressed with this message."
        }
    }else{
        return {
            isNice: true,
            message: "This message was scanned thoroughly and we cannot find anything that suggest that this message is offensive. Use this after your own verification!"
        }
    }
}

