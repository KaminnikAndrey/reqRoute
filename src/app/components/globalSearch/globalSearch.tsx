import { AutoComplete, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {useEffect, useState} from "react";

export default function GlobalSearch() {
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const handleSearch = (value: string) => {
        setOptions(
            value ? [
                { value: 'Результат поиска 1' },
                { value: 'Результат поиска 2' },
            ] : []
        );
    };

    return (
        <div style={{paddingTop: "10px", marginBottom: "15px"}}>
            <AutoComplete
                options={options}
                style={{ width: 400 }}
                onSearch={handleSearch}
            >
                <Input
                    placeholder="Поиск по всему сайту..."
                    prefix={
                        <Space>
                            <SearchOutlined style={{ color: '#000000' }} />
                        </Space>
                    }
                    size="large"
                    allowClear
                />
            </AutoComplete>
        </div>
    );
};