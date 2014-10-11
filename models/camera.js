module.exports = function(sequelize, DataTypes) {
    var Camera = sequelize.define('Camera', {
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        options: {
            type: DataTypes.STRING
        },
    }, {
        createdAt: false,
        updatedAt: false,
    });

    return Camera;
}