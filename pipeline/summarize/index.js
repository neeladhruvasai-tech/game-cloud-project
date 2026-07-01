module.exports = async function (context, timer) {
    const events = context.bindings.inputDocuments;

    const summary = {
        playerId: "dhruva",
        totalScore: events.reduce((a, e) => a + (e.type === "score" ? e.value : 0), 0),
        deaths: events.filter(e => e.type === "death").length,
        levels: events.filter(e => e.type === "level_complete").length,
        timestamp: Date.now()
    };

    context.bindings.outputBlob = JSON.stringify(summary);
};

