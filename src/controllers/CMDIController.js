const { exec } = require("child_process");

class CMDIController {
    static lab(req, res) {
        res.render("cmdi-lab");
    }

    static async ping(req, res) {
        try {
            const ip = req.body.ip || "";

            // KHÔNG AN TOÀN - Sử dụng trực tiếp input vào command (cố tình để demo)
            const cmd = `ping -c 4 ${ip}`;

            console.log("Command thực thi:", cmd);

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    return res.json({
                        error: error.message,
                        command: cmd,
                        output: stderr,
                    });
                }
                res.json({
                    command: cmd,
                    output: stdout,
                });
            });
        } catch (error) {
            res.json({
                error: error.message,
                command: `ping -c 4 ${req.body.ip || ""}`,
                output: "",
            });
        }
    }
}

module.exports = CMDIController;
