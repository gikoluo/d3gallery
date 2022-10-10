<?php

namespace App\Orchid\Screens;

use Orchid\Screen\Screen;
use App\Models\D3Model;
use Orchid\Screen\Actions\Link;
use App\Orchid\Layouts\D3ModelListLayout;

class D3ModelListScreen extends Screen
{
    /**
     * Query data.
     *
     * @return array
     */
    public function query(): array
    {
        return [
            'd3models' => D3Model::paginate()
        ];
    }

    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'D3ModelListScreen';
    }

    /**
     * The description is displayed on the user's screen under the heading
     */
    public function description(): ?string
    {
        return "All D3 models";
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            Link::make('Create new')
                ->icon('pencil')
                ->route('platform.d3model.edit')
        ];
        
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): iterable
    {
        return [
            D3ModelListLayout::class
        ];
    }
}
