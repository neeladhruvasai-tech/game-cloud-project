module.exports = async function (context, req) {
    const event = req.body;

    context.log("Game event received:", event);

    context.bindings.outputDocument = event;

    context.res = {
        status: 200,
        body: { ok: true }
    };
};

